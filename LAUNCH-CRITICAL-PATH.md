# Groove Pal Launch — Critical Path

**Target:** Distribute 10-20 vinyl albums by March 31, 2026 (9 days)
**Starting from:** Zero albums, zero members

---

## Critical Path Blockers (Must Have)

### 1. BUY VINYL (You, Days 1-3)
- [ ] Purchase 10-20 albums from your spreadsheet
- [ ] Source: Local record stores, Discogs, eBay
- [ ] Budget: ~$15-30/album = $150-600 total

**Blocker cleared when:** Physical vinyl in hand

---

### 2. QR CODE SYSTEM (Stitch, Days 1-2)

**What's needed:**
- [ ] Generate unique QR codes for each record (GP-0001 through GP-0020)
- [ ] Each QR points to: `groovepal.com/r/GP-XXXX`
- [ ] Print-ready sticker format (1" x 1" or similar)
- [ ] Design that matches Groove Pal brand

**Output:** PDF of QR stickers ready for printing

**Blocker cleared when:** You can print stickers

---

### 3. ALBUM REGISTRATION (Stitch, Days 2-3)

**What's needed:**
- [ ] Admin page to register albums: `/admin/register`
  - Record ID (GP-0001)
  - Album title
  - Artist
  - Year
  - Genre(s)
- [ ] Data stored in Netlify Blobs or JSON file
- [ ] Generates entry in system

**Blocker cleared when:** You can add albums to the system

---

### 4. RECORD JOURNEY PAGE (Stitch, Days 2-4)

**URL:** `groovepal.com/r/GP-XXXX`

**What it shows:**
- Album info (cover placeholder, title, artist, year)
- Journey stats (starts at 0 listeners, 0 miles)
- Empty listening log
- CTA: "Did you receive this record?" → Log form

**Already have:** `journey-prototype.html` — needs dynamic data

**Blocker cleared when:** QR scan shows the right album

---

### 5. LOG FORM (Stitch, Days 3-5)

**URL:** `groovepal.com/r/GP-XXXX/log`

**Fields (minimal):**
- First name
- City, State
- Favorite track (dropdown)
- Times listened: Side A [ ] Side B [ ]
- Note (optional)
- "Who did you listen with?" (optional)

**On submit:**
- Save to record's journey data
- Show confirmation
- Show "Ready to send it forward?" link

**Already have:** `log-prototype.html` — needs backend

**Blocker cleared when:** Submissions save and appear on journey page

---

### 6. SEND FORWARD FLOW (Stitch, Days 4-6)

**URL:** `groovepal.com/r/GP-XXXX/send`

**MVP version (no matching algorithm):**
- "Who should get this next?"
- Option A: "I know someone" → Enter their email
- Option B: "Find me someone" → Shows Kyle's address (you manually match for now)
- Display shipping address
- "Mark as shipped" button

**Blocker cleared when:** User can get a destination and mark shipped

---

### 7. PAYMENT / JOIN (Stitch, Days 5-7)

**For initial batch:** You're giving these away to seed the network — no payment needed yet.

**For new members joining later:**
- [ ] Stripe checkout for $35
- [ ] Creates member account
- [ ] Gets assigned a welcome record

**MVP:** Can skip for launch batch if recipients are friends/family

**Blocker cleared when:** You have a way to collect $35 (even if just Stripe link)

---

### 8. PRINT QR STICKERS (You, Days 5-7)

**Options:**
- Home printer + Avery labels (fastest)
- Sticker Mule / local print shop (nicer)
- Cricut/silhouette if you have one

**Sticker specs:**
- 1" x 1" or 1.5" x 1.5"
- QR code + "GP-XXXX" text
- Optional: Groove Pal logo

**Blocker cleared when:** Physical stickers in hand

---

### 9. ATTACH STICKERS + SHIP (You, Days 7-9)

- [ ] Put sticker on each record sleeve
- [ ] Include info card explaining Groove Pal
- [ ] Ship to initial recipients (friends, family, volunteers)

**Blocker cleared when:** Records are in the mail

---

## Not Critical for Launch (Do Later)

- [ ] Fancy album cover images (use placeholders)
- [ ] Heat maps and visualizations
- [ ] Knowledge graph queries
- [ ] Member dashboard
- [ ] Groove Loop rewards
- [ ] Automatic matching algorithm
- [ ] Email notifications

---

## Simplified Architecture

```
groovepal.com/
├── index.html          ← Landing page (DONE)
├── r/GP-XXXX           ← Record journey page (NEED)
├── r/GP-XXXX/log       ← Log your listen (NEED)
├── r/GP-XXXX/send      ← Send forward (NEED)
├── admin/register      ← Add new albums (NEED)
└── join                ← $35 signup (LATER)
```

**Data storage:** Netlify Blobs (one blob per record ID)

---

## Day-by-Day Plan

| Day | Date | You | Stitch |
|-----|------|-----|--------|
| 1 | Mar 22 | Start buying vinyl | QR generator + sticker design |
| 2 | Mar 23 | Continue sourcing | Album registration admin |
| 3 | Mar 24 | Finalize album list | Dynamic journey page |
| 4 | Mar 25 | — | Log form backend |
| 5 | Mar 26 | Print stickers | Send forward flow |
| 6 | Mar 27 | — | Testing + fixes |
| 7 | Mar 28 | Attach stickers | Stripe link (basic) |
| 8 | Mar 29 | Package records | Final testing |
| 9 | Mar 30 | Ship! | Monitor |

---

## Definition of Done

**Launch = Records in mail with functional QR codes**

A recipient can:
1. ✅ Scan QR code on record
2. ✅ See album info and (empty) journey
3. ✅ Log their listen after enjoying it
4. ✅ Get an address to send it forward
5. ✅ Mark it as shipped

---

## Open Questions

1. **First recipients:** Friends/family or strangers? (Affects trust + feedback quality)
2. **Info card:** What text? Want me to draft it?
3. **Sticker style:** Minimal QR only? Or branded with logo?
4. **Album selection:** Want input on which 10-20 to buy?

---

*Last updated: March 21, 2026*
