import os
import cv2
import numpy as np

src = cv2.imread("img/orion.jpeg")
h, w = src.shape[:2]
gray = cv2.cvtColor(src, cv2.COLOR_BGR2GRAY)

boxes = [(505, 182, 1090, 325), (600, 335, 1000, 390), (655, 592, 950, 642)]

mask = np.zeros((h, w), np.uint8)
for x1, y1, x2, y2 in boxes:
    roi = gray[y1:y2, x1:x2]
    local_bg = cv2.medianBlur(roi, 31)
    text = ((roi.astype(int) - local_bg.astype(int)) > 18).astype(np.uint8) * 255
    mask[y1:y2, x1:x2] = text
mask = cv2.dilate(mask, np.ones((7, 7), np.uint8), iterations=2)

out = cv2.inpaint(src, mask, 9, cv2.INPAINT_TELEA)
soft = cv2.GaussianBlur(out, (0, 0), 6)
region = np.zeros((h, w), np.float32)
for x1, y1, x2, y2 in boxes:
    region[max(0, y1 - 20):y2 + 20, max(0, x1 - 30):x2 + 30] = 1
region = cv2.GaussianBlur(region, (0, 0), 14)[..., None]
out = (out * (1 - region) + soft * region).astype(np.uint8)

cv2.imwrite("img/orion-hero.webp", out, [cv2.IMWRITE_WEBP_QUALITY, 86])
cv2.imwrite(os.path.join(os.environ["TEMP"], "orion_clean_preview.png"), out[:, 300:1300])
cv2.imwrite(os.path.join(os.environ["TEMP"], "orion_mask.png"), mask[:, 300:1300])
print(out.shape, os.path.getsize("img/orion-hero.webp"))
