"""End-to-end test of api/tickets-admin.php + tickets-public.php against a local php -S server."""
import http.cookiejar
import json
import subprocess
import sys
import urllib.error
import urllib.request

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8899"
ADMIN = BASE + "/api/tickets-admin.php"
fails = 0


class Client:
    def __init__(self):
        self.jar = http.cookiejar.CookieJar()
        self.op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(self.jar))
        self.csrf = ""

    def req(self, url, data=None, csrf=True):
        headers = {"Accept": "application/json"}
        body = None
        if data is not None:
            body = json.dumps(data).encode()
            headers["Content-Type"] = "application/json"
            if csrf:
                headers["X-CSRF-Token"] = self.csrf
        r = urllib.request.Request(url, data=body, headers=headers)
        try:
            resp = self.op.open(r)
            status, raw = resp.status, resp.read()
        except urllib.error.HTTPError as e:
            status, raw = e.code, e.read()
        try:
            out = json.loads(raw.decode("utf-8-sig"))
        except Exception:
            out = {"_raw": raw.decode("utf-8", "replace")}
        if isinstance(out, dict) and out.get("csrf"):
            self.csrf = out["csrf"]
        return status, out

    def post(self, action, csrf=True, **kw):
        kw["action"] = action
        return self.req(ADMIN, kw, csrf)


def check(name, cond, extra=""):
    global fails
    print(("PASS " if cond else "FAIL ") + name + ("" if cond else "  -> " + str(extra)[:400]))
    if not cond:
        fails += 1


admin = Client()
s, d = admin.req(ADMIN + "?action=session")
check("session without login", s == 200 and d.get("user") is None, d)

s, d = admin.post("login", username="admin", password="wrong")
check("wrong password rejected", s == 401, d)

s, d = admin.post("login", username="ADMIN", password="1234")
check("admin/1234 login", s == 200 and d["user"]["role"] == "admin", d)
check("must change password flag", d["user"]["mustChangePassword"] is True, d)
check("5 seeded festivals", len(d["festivals"]) == 5, [f["id"] for f in d.get("festivals", [])])

s, d = admin.post("festival_toggle", id="jazz", field="active", value=False)
check("blocked until password changed", s == 403, d)

s, d = admin.post("change_password", current="1234", new="short")
check("short password rejected", s == 400, d)
s, d = admin.post("change_password", current="1234", new="DerandAdmin2026")
check("password changed", s == 200 and not d["user"]["mustChangePassword"], d)
boot = d

s, d = admin.post("festival_toggle", csrf=False, id="jazz", field="active", value=False)
check("missing CSRF token rejected", s == 419, d)

fest = [f for f in boot["festivals"] if f["id"] == "sunnyhill"][0]
fest.pop("stats", None)
fest["tiers"][0]["capacity"] = 5
s, d = admin.post("festival_save", originalId="sunnyhill", festival=fest)
check("set Regular limit = 5", s == 200, d)

s, d = admin.post("order_manual", festivalId="sunnyhill", tierKey="regular", quantity=3, paymentMethod="cash",
                  guest={"firstName": "Arta", "lastName": "Berisha", "email": "arta@example.com", "phone": "+38344111222"})
check("manual sale x3", s == 200, d)
s, d = admin.post("order_manual", festivalId="sunnyhill", tierKey="regular", quantity=3, paymentMethod="cash",
                  guest={"firstName": "Too", "lastName": "Many"})
check("over limit blocked (409)", s == 409, d)

s, d = admin.post("delivery_add", festivalId="sunnyhill", tierKey="regular", quantity=2, broughtBy="Sunny Hill office")
check("delivery of 2 recorded", s == 200, d)
st = [f for f in d["festivals"] if f["id"] == "sunnyhill"][0]["stats"]["tiers"]["regular"]
check("stats sold=3 received=2 toBring=1 remaining=2",
      (st["sold"], st["received"], st["toBring"], st["remaining"]) == (3, 2, 1, 2), st)

order_id = d["orders"][0]["id"]
s, d = admin.post("order_update", id=order_id, collected=True)
check("hand over to guest", s == 200 and d["orders"][0]["collected"], d)

s, d = admin.post("user_save", user={"name": "Sunny Hill Boss", "username": "sunnyhill", "role": "partner",
                                     "festivals": ["sunnyhill"], "password": "SunnyBoss2026", "mustChangePassword": False})
check("partner user created", s == 200 and any(u["username"] == "sunnyhill" for u in d["users"]), d)
s, d = admin.post("user_save", user={"name": "X", "username": "sunnyhill", "role": "staff", "password": "Another2026x"})
check("duplicate username rejected", s == 400, d)

# Online checkout recorded + webhook-paid, via the same library functions the payment code calls.
php = r"""
require 'api/tickets-lib.php';
tickets_record_online_order(['id'=>'TICKETS-TEST-1','orderIdentification'=>'rai-1','festivalId'=>'sunnyhill','festivalName'=>'Sunny Hill Festival',
 'tierKey'=>'regular','tierLabel'=>'Regular','quantity'=>1,'unitPrice'=>195.0,'total'=>195.0,'mode'=>'tickets','roomLabel'=>'','nights'=>null,
 'transfer'=>false,'guest'=>['firstName'=>'Online','lastName'=>'Guest','email'=>'o@example.com','phone'=>'1']]);
echo json_encode(['avail_pending'=>tickets_available('sunnyhill','regular'),
 'paid'=>tickets_set_payment_status('TICKETS-TEST-1','paid',['transactionId'=>'t1']),
 'paid_again'=>tickets_set_payment_status('TICKETS-TEST-1','paid'),
 'late_cancel'=>tickets_set_payment_status('TICKETS-TEST-1','cancelled'),
 'avail_after'=>tickets_available('sunnyhill','regular')]);
"""
out = json.loads(subprocess.check_output(["php", "-r", php]).decode())
check("online order holds stock while paying", out["avail_pending"] == 1, out)
check("paid once, idempotent, never downgraded", out["paid"] and not out["paid_again"] and not out["late_cancel"], out)
check("stock after online sale = 1", out["avail_after"] == 1, out)

s, pub = Client().req(BASE + "/api/tickets-public.php")
reg = [t for f in pub["festivals"] if f["id"] == "sunnyhill" for t in f["tiers"] if t["key"] == "regular"][0]
check("public shows 'left' = 1", reg["left"] == 1 and not reg["soldOut"], reg)

partner = Client()
s, d = partner.post("login", username="sunnyhill", password="SunnyBoss2026")
check("partner login", s == 200 and d["user"]["role"] == "partner", d)
check("partner sees only Sunny Hill", [f["id"] for f in d["festivals"]] == ["sunnyhill"], [f["id"] for f in d["festivals"]])
check("partner gets no users / audit", "users" not in d and "audit" not in d, list(d))
check("partner gets no guest contact data", all("guest" not in o for o in d["orders"]), d["orders"][:1])
s, d2 = partner.post("order_update", id=order_id, collected=False)
check("partner cannot change orders", s == 403, d2)
s, d2 = partner.post("delivery_add", festivalId="dokufest", tierKey="film", quantity=1)
check("partner cannot write deliveries", s == 403, d2)

r = partner.op.open(ADMIN + "?action=export&festival=sunnyhill")
csv = r.read().decode("utf-8-sig")
check("partner CSV has orders, no emails", "Arta Berisha" in csv and "arta@example.com" not in csv, csv[:300])

s, d = admin.post("user_save", user={"name": "n", "username": "x1", "role": "partner", "festivals": [], "password": "Abcdefgh12"})
check("partner without festival rejected", s == 400, d)

s, d = admin.post("festival_save", originalId="sunnyhill", festival=dict(fest, tiers=fest["tiers"][1:]))
check("cannot delete ticket type that has orders", s == 400, d)
s, d = admin.post("festival_delete", id="sunnyhill")
check("cannot delete festival that has orders", s == 400, d)

new = {"name": "Test Fest", "city": "Prishtina", "dates": "1 Jan 2028", "month": 1, "days": 1, "nights": 1, "genre": "Rock",
       "img": "", "badge": {"text": "New", "style": "cyan", "icon": "star"}, "active": True, "salesOpen": True,
       "tiers": [{"label": "Day Pass", "note": "1 day", "price": 20, "capacity": "", "active": True}]}
s, d = admin.post("festival_save", originalId="", festival=new)
check("new festival created with id test-fest", s == 200 and d.get("saved") == "test-fest", d)
s, d = admin.post("festival_delete", id="test-fest")
check("empty festival deleted", s == 200 and all(f["id"] != "test-fest" for f in d["festivals"]), d)

s, d = admin.post("logout")
s, d = admin.req(ADMIN + "?action=session")
check("logged out", d.get("user") is None, d)

bad = Client()
codes = [bad.post("login", username="nobody", password="x")[0] for _ in range(9)]
check("rate limit after 8 failures", codes[-1] == 429, codes)

print("\n%d failure(s)" % fails)
sys.exit(1 if fails else 0)
