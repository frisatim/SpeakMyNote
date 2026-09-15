# PRODUCT.md — scope and user journey

Source: `docs/BUILD_PLAN.md` sections 1–3 and 8. This file restates the
product boundary in English for code agents. When in doubt, the plan wins.

## Promise

**Turn today's lesson into a conversation.** Photograph class notes, check the
extracted lesson, practise speaking for a few minutes. The app keeps what was
practised and adapts the next sessions.

## Audience

Tim first (personal use), then a private beta with a handful of friends
(two testers first, ideally one Android and one iPhone; five to ten later).

## First expected result

On a real phone: import a photo, correct the extracted words, complete five
voice exchanges, fully close the app, reopen it and find the lesson and the
progress intact.

## V1 scope

| In the beta | Later, only if useful |
| --- | --- |
| Android and iOS from one codebase | Desktop app or full web version |
| Mandarin Chinese (`zh`), Korean (`ko`), French (`fr`) | Other languages, multilingual UI |
| UI and explanations in English | Translated UI |
| One photo per lesson, camera or gallery | PDF, photo batches, whole notebooks |
| Editable extraction of vocabulary and grammar | Automatic import without review |
| Conversation grounded in the lesson | Full curriculum, exercises, flashcards |
| Tap to start / tap to stop recording | Continuous audio, automatic turn detection |
| Written + spoken reply, help and repeat | Avatars, custom voices, complex animation |
| Local history and per-language memory | Accounts, sync, advanced dashboard |
| Beta access via individual code | Subscriptions and payments |

Manual text entry for lessons and messages exists as a fallback. It must not
become a second product.

## Screens and journey

1. **Welcome.** Choose Chinese, Korean or French. English is the fixed support
   language. No CEFR questionnaire. A short notice explains that photos and
   recordings are sent to AI services for processing and that history is kept
   on this device.
2. **My lessons.** Lessons for the selected language, an **Add notes** button
   and access to previous sessions. Switching language deletes nothing.
3. **Add notes.** Take or pick a photo. Preview, replace, or **Extract lesson**.
   Manual entry stays available.
4. **Review lesson.** Edit term, reading and English meaning; delete doubtful
   items; fix grammar patterns; flag unreadable areas. Select at most **10
   words and 2 grammar patterns** for the session without removing the others
   from the lesson.
5. **Practice.** Short situation proposed from the notes, message list,
   **Record/Stop** button, editable transcript before sending, spoken reply,
   **Repeat**, **Show meaning**, **Help me answer**, **End session**. At most
   one priority correction at a time, never blocking.
6. **Session recap.** Active duration, items practised, two or three
   evidence-backed observations, **Practice again**. No invented level.
7. **Settings.** Language, show/hide readings, **Test voice**, beta code,
   backup export/import, delete data.

## Language display rules

| Language | Code | Initial TTS locale | Display |
| --- | --- | --- | --- |
| Mandarin | `zh` | `zh-CN` | Characters + pinyin; keep the photo's script (no silent traditional/simplified conversion) |
| Korean | `ko` | `ko-KR` | Hangul, romanization can be hidden |
| French | `fr` | `fr-FR` | `reading = null`; no IPA in V1 |

Meanings and explanations are always in English. Locales are starting choices;
real voice availability is checked on phones.

## Audio loop (V1)

1. User taps **Record**; any ongoing TTS stops.
2. User speaks, taps **Stop**; visible counter, hard stop at 60 seconds.
3. App uploads the file, shows **Transcribing**.
4. Transcript shown with **Send / Edit / Try again**. Explicit confirmation
   avoids treating a bad transcription as a learner mistake.
5. After **Send**, the tutor returns one or two sentences and a short question;
   the app shows and speaks the text.
6. An optional correction appears under the message. TTS only reads the
   target-language text, never metadata or the English explanation.
7. At session end, the evaluation is requested and applied transactionally to
   memory. The recap may show **Analysis pending** while still showing local
   duration and exchanges immediately.

States: `idle`, `recording`, `transcribing`, `reviewing`, `thinking`,
`speaking`, `error`. One submitted turn at a time. A late response must never
attach to another session. Backgrounding cleanly stops recording and speech.

Known platform caveat: `expo-speech` can stay silent on a physical iPhone in
silent mode. Provide **Test voice** and contextual help.

## Tutor behaviour

- Target language, short beginner-friendly sentences, one question at a time.
- Uses the active lesson vocabulary naturally. Function words and vocabulary
  needed for a natural sentence are allowed; "only the ten words" is not a rule.
- At most one short optional correction in English per turn.
- Never invents CEFR levels or pronunciation assessments.
- Turns produced with **Help me answer**, or typed/edited after transcription,
  are marked as assisted / non-oral and do not count as spontaneous oral recall.

## Privacy wording (for the Welcome notice and Settings)

- Photos and recordings are sent to AI services for processing.
- Learning history is stored on this device. Without export, uninstalling or
  changing phone can lose it.
- Do not promise "nothing leaves your phone": provider data policies are
  separate from the app's.

## Success measures for the beta

Usable photo rate, time to first exchange, latency after Send, unjustified
corrections, cost per session, and whether testers want to do another session.
A useful ten-minute conversation matters more than a nice dashboard.
