# Sound credits

The mix uses edited recordings with RPM-dependent playback and crossfades.
It is an audio adaptation for the simulation, not a factory BMW M5 F10 recording.

## Engine idle

- Files: `engine-idle.wav`.
- Recording: **Car Engine: Maserati GranTurismo Switch to Sport Mode and Launch**, a recorded 2018 Maserati GranTurismo V8, by **myeclecticself**.
- Source: https://freesound.org/people/myeclecticself/sounds/585215/
- License: **CC0 1.0**, https://creativecommons.org/publicdomain/zero/1.0/
- Changes: the steady idle excerpt before sport mode and launch, mono conversion, gentle band limiting, normalization and loop crossfade. No voice removal or transient reconstruction is applied. The idle recording plays at its natural pitch at the simulation's 800 rpm idle.

## Engine under load

- Files: `engine-low.wav`, `engine-high.wav`.
- Recording: **Audi V8 Acceleration Sound**, by **FFKoenigsegg20012017**.
- Source: https://freesound.org/people/FFKoenigsegg20012017/sounds/339703/
- License: **CC0 1.0**, https://creativecommons.org/publicdomain/zero/1.0/
- Changes: separate excerpts, mono conversion, filtering, normalization and loop crossfades.
- Playback pitch and layer balance follow the simulated RPM and throttle load.

## Rain

- File: `rain.wav`.
- Recording: **Rain_Loop.wav**, a field recording made with a Zoom H2N, by **Snoopy20111**.
- Source: https://freesound.org/people/Snoopy20111/sounds/399072/
- License: **CC0 1.0**, https://creativecommons.org/publicdomain/zero/1.0/
- Changes: excerpt, mono conversion, filtering, normalization and loop crossfade. Background bird calls (narrow tonal events around 3 kHz) were removed with circular spectral attenuation, leaving the broadband rain intact.

## Tyres under hard braking

- File: `tyres.wav`.
- Recording: **Car tire squeal skid loop**, original recording by **audible-edge (Tom Haigh)**; loop edit by **Iwan “qubodup” Gabovitch**.
- Source: https://opengameart.org/content/car-tire-squeal-skid-loop
- Original recording: https://freesound.org/people/audible-edge/sounds/71739/
- License: **CC BY 3.0**, https://creativecommons.org/licenses/by/3.0/
- Changes: resampled, filtered, normalized and loop seam crossfaded; volume follows braking and speed.
