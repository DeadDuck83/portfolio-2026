# Analytics events

LogRocket project: `hsztbz/portfolio-site-traffic`. Code: `src/lib/analytics.ts` (every event and its properties, typed), `src/lib/engagement.ts` (EngagedSession), `src/hooks/useSectionViews.ts` (section views).

LogRocket already records page visits, clicks and touches, scroll depth, active time, device type, rage and dead clicks for every session. **Those are not repeated as custom events.** Custom events only cover what LogRocket can't see on its own: which project, which avatar prompt, how a visitor reached a case study, and whether they actually engaged.

No event carries personal data. Avatar events use prompt IDs, never text.

## Turning it off

LogRocket runs only when **all** of these hold:

1. It's a production build. `npm run dev` and the tests never record. In dev, events print to the browser console as `[analytics] EventName {…}` instead, so you can check them without sending anything.
2. `VITE_LOGROCKET_DISABLED` isn't `true` at build time. Set it in Cloudflare (Workers Builds → Variables) to switch recording off site-wide without a code change, for example if the session quota runs out.
3. The browser hasn't opted out.

### Opting your own devices out

Visit any page with `?analytics=off` once per browser:

```
https://derekjmoore.com/?analytics=off
```

A small alert confirms it. The flag is saved in that browser's localStorage, so it sticks, and it's checked before LogRocket starts, so that visit isn't recorded either. `?analytics=on` turns it back on.

Do it once in each place you test from:

- **Chrome (Mac):** each Chrome profile is separate. Incognito windows don't keep the flag, so redo it per incognito window, or test in your normal window.
- **Safari (Mac and iPhone):** the same URL works, including on the phone, which has no console. Private tabs don't keep the flag. Safari can clear site storage for sites you haven't visited in about seven days. If you go a week without visiting, redo it.
- **Other phones and tablets:** same URL.

The param only ever affects the browser that visits it, so it's harmless if someone else finds it.

### Your past sessions

Your known Chrome/Mac visitor is `6367bdcf-4326-4a8c-aa8c-825ea7b0ac4b`. Opt-out stops new recordings, but the existing ones stay in LogRocket. Exclude them in the dashboard: add **User ID is not 6367bdcf-4326-4a8c-aa8c-825ea7b0ac4b** to the saved segments below. User IDs are per browser (they come from the site's anonymous `portfolio_visitor_id`), so the same person on Safari shows up under a different ID.

## Events

| Event | Properties | Fires when |
|---|---|---|
| `PortfolioSectionViewed` | `sectionId`: work, about, contact | A homepage section has been on screen for 1 s. "On screen" means half the section, or half the screen for tall sections. Once per section per visit. The hero isn't counted because it's always on screen when a visitor lands. |
| `AboutChapterView` | `chapter` (1–5), `name` | *(existing)* An About chapter takes focus for the first time. |
| `WorkItemClick` | `projectId`, `position` (1–4, place in the grid), `source`: hero-grid | *(existing name, new properties)* A work tile is picked. |
| `CaseStudyViewed` | `projectId`, `source`: work-grid, next-case, avatar, direct, other | A case study page is entered (direct visit or in-site), once per visit. `direct` = the visitor landed on it. `other` = header link or browser back/forward. |
| `CaseStudySectionViewed` | `projectId`, `sectionId`: brief, context, users, process, solution, outcome | A chapter has been on screen for 1 s, once per chapter per visit. These are the case studies' own chapters, the same in every study. `users` exists on PLMC only. |
| `GetInTouchClick` | `source`: hero, header, menu, footer | *(existing name)* A "Get in touch" or "Contact" link is clicked. These links scroll to the contact section; they don't copy anything. |
| `EmailCopied` | `source`: hero, contact, footer, case-header | The email copy button is clicked. This is the real contact action: the site copies the address instead of opening a mail app. |
| `ExternalProfileClick` | `profile`: linkedin, `source`: hero, contact | A LinkedIn link is clicked. |
| `ResumeClick` | `source`: hero, contact | A résumé link is clicked. **Inactive until `RESUME_URL` is set in `src/data/site.ts`**: the links don't render without it. |
| `AvatarOpened` | `source`: hero-tile, button, auto | The call card opens. `button` = the floating face button. `auto` = it opened by itself (pages without the hero tile). |
| `AvatarPromptSelected` | `promptId`, `kind`: question, tour, case-walk, keep-going, shirt | The visitor picks something in the card. IDs: journey, work, case-study, skills, real-ai, wisdom, shirt, free-typing (the "Free typing is coming soon" box, which shows demand for typing), walk-sage / walk-bexa / walk-parker-ace / walk-plmc, keep-going-*, shirt-light-blue / shirt-red / … |
| `AvatarInteractionCompleted` | `promptId`, `kind`, `durationSeconds` | That answer (or the whole tour or walk) played to the end. It doesn't fire if the visitor interrupted it or closed the card. |
| `AvatarClosed` | `durationSeconds`, `interactionCount` | The card is minimized. Count 0 = opened, then dismissed without asking anything. |
| `AvatarSettingChanged` | `setting`: camera, sound, `on` | Camera or sound toggled. Camera off = they prefer reading. |
| `AvatarError` | `errorCategory`: avatar-load, audio-blocked | The avatar failed to load, or the browser blocked his voice. At most once per page load each. |
| `TelemetryBayOpened` | none | *(was "Footer pulled up")* The footer easter egg was pulled open. |
| `EngagedSession` | `activeSeconds`, `interactions` | Once per browser session, after **15 s of active, visible time and 2 deliberate inputs** (tap, click, key, wheel or touch scroll). Background-tab time and time more than 30 s after the last input don't count, and scripted input is ignored. Thresholds live in `ENGAGEMENT` in `src/lib/engagement.ts`. |
| `AutomatedBrowser` | none | The browser reports it's driven by automation (`navigator.webdriver`: Playwright, Selenium, Puppeteer). Once per page load. |

### Renamed avatar events

Older sessions have these names. Use both when looking at data from before this change.

| Old | New |
|---|---|
| Avatar opened / Avatar popped up / Avatar reopened | `AvatarOpened` (source hero-tile / auto / button) |
| Avatar chip asked, Avatar shirt, Avatar case study | `AvatarPromptSelected` |
| Avatar camera on / off | `AvatarSettingChanged` |
| Footer pulled up | `TelemetryBayOpened` |
| Avatar joined, Avatar nudge, Avatar navigated, Avatar moved | dropped (duplicates of the above, or card fiddling) |

`WorkItemClick` used to carry `title`, `numeral` and `route`. It now carries `projectId` and `position`.

## Deliberately not custom events

LogRocket already answers these with built-in filters, so they're not sent twice:

| Asked for | Use instead |
|---|---|
| `deviceType` on every event | **Device** filter (Desktop, Mobile, Tablet) |
| `inputType` on events | Device filter plus session replay. Touch versus mouse adds little beyond device. |
| `pageType` | **Visited URL**, and the event names themselves (CaseStudy* events only fire on case studies) |
| `NavigationClick`, `MobileMenuToggle`, `CaseStudyBackClick` | **Clicked** filter (by text, e.g. "About", "Menu", "Work", or by selector) |
| `CaseStudyDepthReached` (25/50/75/100) | **Scroll Depth** filter and **Scrollmaps**. Chapter views say more than percentages. |
| `ActiveTimeMilestone` (30/60/180 s) | **Active Time in Session** filter |
| `MeaningfulInteraction` | Clicked / Touched filters, and `EngagedSession` |
| `AvatarInteractionStarted` | Same moment as `AvatarPromptSelected`: there's no free text or voice input to start any other way |
| `promptCategory` | About 10 prompt IDs that read clearly on their own; a category layer would only need upkeep |
| `TrafficQualitySignal` with heuristic reason codes | `EngagedSession` plus `AutomatedBrowser`, see below. Timing-pattern heuristics are easy to fool and hard to explain. |

## Can't be tracked: the UI doesn't exist

- **Contact form submitted:** there's no form. Contact is a copy-email button (`EmailCopied`).
- **Résumé open / download:** wired up, but no résumé link renders until `RESUME_URL` is set. It's a link that opens in a new tab, so there's no separate download action.
- **GitHub profile:** there's no GitHub link, only LinkedIn.
- **Avatar text / voice input:** visitors can't type or speak to it. He speaks pre-recorded lines in reply to set prompts.
- **Return to top:** there's no control for it, apart from the header wordmark, which a Clicked filter covers.

## Telling people from bots

Nothing here blocks or hides traffic. These are only segments:

- **Likely real:** `EngagedSession`. Someone was on a visible tab for 15 s or more and deliberately scrolled, tapped or clicked twice. Readers who scroll qualify; readers who never touch the page don't. That's the trade-off.
- **Likely automated:** `AutomatedBrowser`, or no `EngagedSession` with Active Time in Session under about 5 s and no Clicked or Touched activity. Treat it as "unknown", not "bot": one short visit doesn't make someone a bot, and good bots can fake input.
- Repeat behavior is visible per User ID (User Session Count, User First Seen), so a visitor who keeps bouncing in under 5 s stands out without client-side heuristics.

## Checking it works

1. **Locally:** `npm run dev`, open the console and click around. Every event prints as `[analytics] Name {props}`.
2. **In LogRocket, after a deploy:** open a private window (a new visitor ID, not opted out), visit derekjmoore.com, open the avatar and ask something, open a case study and scroll it, then copy the email. In LogRocket, find the session and check the custom events in its timeline. Then exclude that test visitor's User ID, or delete the session.

## Dashboard: Portfolio UX Insights

One-time setup in LogRocket:

1. **Saved segment "Visitors":** User ID is not 6367bdcf-4326-4a8c-aa8c-825ea7b0ac4b (add any other test IDs), and Custom Event is not AutomatedBrowser.
2. **"Engaged visitors":** Visitors + Custom Event EngagedSession.
3. **"Avatar dismissers":** Visitors + AvatarOpened + no AvatarPromptSelected.
4. **"Contact intent":** Visitors + any of EmailCopied, ExternalProfileClick, ResumeClick.

Charts, all on the Visitors segment:

- Engaged sessions per week (EngagedSession count). The headline number.
- Case study interest: CaseStudyViewed split by `projectId`, and separately by `source`.
- Chapter reach: CaseStudySectionViewed split by `sectionId`, one chart per project. Where the bars drop off is where readers stop.
- Scrollmap for each `/work/*` page: where on the page people stop.
- Avatar: AvatarPromptSelected by `promptId`. Compare with AvatarInteractionCompleted by `promptId` to see which answers people sit through.
- Contact intent: EmailCopied by `source`. Which button actually gets used.
- Device split: sessions by Device, Engaged visitors only.

Funnels:

- **Work to contact:** EngagedSession → CaseStudyViewed → CaseStudySectionViewed (sectionId outcome) → EmailCopied.
- **Avatar:** AvatarOpened → AvatarPromptSelected → AvatarInteractionCompleted → CaseStudyViewed.
- **Grid:** PortfolioSectionViewed (work) → WorkItemClick → CaseStudyViewed.

Check in LogRocket whether your plan's charts can split or filter a custom event by a property (for example `projectId`). Its filters page doesn't say. If they can't, use Visited URL `/work/sage` and so on as the per-project step instead.
