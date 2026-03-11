# BunnyCDN setup for image uploads

Images uploaded by users (portfolio, ID, selfie, profile) are stored in your Bunny **Storage Zone** and served through a **Pull Zone**. If you see "Domain suspended or not configured" when opening image URLs, the Pull Zone is missing or not connected.

## 1. Storage Zone (you already have this)

- **Storage Zone name**: e.g. `model-m`
- **FTP & API access**: Dashboard → Storage → model-m → **FTP & API access**
- Copy the **Password (Full Access)** and set it as `BUNNY_STORAGE_API_KEY` in your server environment (e.g. Render).

## 2. Create and connect a Pull Zone

A **Pull Zone** is what serves your files at a URL like `https://model-m.b-cdn.net/...`. Without it, `model-m.b-cdn.net` shows "Domain suspended or not configured".

1. In Bunny dashboard go to **CDN** (or **Pull Zones**) → **Add Pull Zone**.
2. **Name**: e.g. `model-m` (can match your storage zone name).
3. **Origin type**: choose **Storage Zone** (not "URL").
4. **Origin Storage Zone**: select your storage zone, e.g. `model-m`.
5. Create the Pull Zone. Bunny will assign a hostname like `model-m.b-cdn.net` (or you can add a custom domain later).
6. Copy the Pull Zone URL (e.g. `https://model-m.b-cdn.net`) and set it in your server env as **`BUNNY_CDN_URL`** (no trailing slash).

After this, image URLs returned by the API (e.g. `https://model-m.b-cdn.net/images/portfolio/...`) will load correctly.

## 3. Folder structure in Storage Zone

Uploads are stored under a single root folder **`images/`** so the File Manager is easy to read:

```
model-m (Storage Zone)
└── images/
    ├── portfolio/
    │   └── {user-id}/          ← one folder per user (MongoDB _id)
    │       └── *.png, *.jpg
    ├── id/
    │   └── {user-id}/
    │       └── *.png, *.jpg
    ├── selfie/
    │   └── {user-id}/
    │       └── *.png, *.jpg
    └── profile/
        └── {user-id}/
            └── *.png, *.jpg
```

- **Folder name = user id**: Each user’s files live under `images/{type}/{user-id}/`. The `user-id` is the MongoDB user `_id`, so in the File Manager you see one folder per user and can find files by user easily.
- **Types**: `portfolio`, `id`, `selfie`, `profile`.

You do **not** need to create these folders manually; the API creates them when the first file is uploaded.

## 4. Environment variables (summary)

| Variable | Where to get it | Required |
|----------|------------------|----------|
| `BUNNY_STORAGE_ZONE` | Storage Zone name (e.g. `model-m`) | Optional, default `model-m` |
| `BUNNY_STORAGE_API_KEY` | Storage → FTP & API access → **Password (Full Access)** | Yes (or uploads return 503) |
| `BUNNY_CDN_URL` | Pull Zone URL (e.g. `https://model-m.b-cdn.net`) | Yes (or image URLs may not load) |
| `BUNNY_STORAGE_REGION` | Optional, e.g. `storage`, `ny`, `la` | Optional |

After setting these and redeploying, new uploads will appear under `images/` and will be viewable at `BUNNY_CDN_URL/images/...`.
