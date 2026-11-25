# BMW M5 F10 model attribution

Title: 2013 BMW M5 F10

Author: Galaxy Car Showroom (https://sketchfab.com/adrianaflak09)

Source: https://sketchfab.com/3d-models/2013-bmw-m5-f10-70e0780ffa784b82982921869cb2a370

License: Creative Commons Attribution 4.0 International (CC BY 4.0)
https://creativecommons.org/licenses/by/4.0/

The original GLB remains unmodified. The viewer adapts its scale and orientation,
separates wheels and rear lamps at runtime, and adds driving, suspension and brake
light behavior.

# Sky photograph

File: `sky/sky-day.jpg`

Title: Sunflowers

Author: Sergej Majboroda, Poly Haven

Source: https://polyhaven.com/a/sunflowers

License: CC0 1.0 Universal (public domain), https://creativecommons.org/publicdomain/zero/1.0/

Adaptation: the tonemapped JPEG was scaled to 4096 wide and cropped from the
zenith to 5.98° below the horizon, 4096 × 1092.

# Ground textures

Files: `ground/asphalt.jpg`, `ground/asphalt-normal.jpg`, `ground/asphalt-arm.jpg`,
`ground/asphalt-height.jpg`, `ground/grass.jpg`, `ground/gravel.jpg`

Titles: Asphalt Track (Dimitrios Savva), Leafy Grass (Charlotte Baglioni), Rocks Ground 02
(Rob Tuytel), Poly Haven

Sources: https://polyhaven.com/a/asphalt_track, https://polyhaven.com/a/leafy_grass,
https://polyhaven.com/a/rocks_ground_02

License: CC0 1.0 Universal (public domain), https://creativecommons.org/publicdomain/zero/1.0/

Adaptation: the asphalt colour and normal maps were re-encoded at 2048 × 2048, and
the normal map high-pass filtered (broad tilts removed, fine relief kept);
the roughness/occlusion (ARM) and height maps are the 1024 × 1024 originals.
The viewer lightens and desaturates the asphalt colour at runtime.

# Concrete texture

Files: `concrete/concrete.jpg`, `concrete/concrete-normal.jpg`, `concrete/concrete-arm.jpg`

Title: Concrete Wall 006 (Charlotte Baglioni, Dario Barresi), Poly Haven

Source: https://polyhaven.com/a/concrete_wall_006

License: CC0 1.0 Universal (public domain), https://creativecommons.org/publicdomain/zero/1.0/

Adaptation: the 1024 × 1024 originals; the viewer tints the colour pale grey
or red for the checkpoints' blocks.

# Skidding-car (DSC) symbol

Used in: `public/instruments.js` (the DSC warning light in the cluster)

Source: Material Design Icons, `car-traction-control` (@mdi/svg 7.4.47), https://pictogrammers.com/library/mdi/icon/car-traction-control/

License: Apache License 2.0, https://www.apache.org/licenses/LICENSE-2.0

Adaptation: the path is drawn in amber inside the cluster's SVG.

## Routes: Zhytomyr – Kyiv (route-m06.json) and Dnipro – Zaporizhzhia (route-n08.json)

Road geometry, place names and, for the N-08, the buildings and ponds beside it: © OpenStreetMap contributors, available under the Open Database License (ODbL), https://www.openstreetmap.org/copyright. Routed with the OSRM demo server (https://project-osrm.org/).

Heights: SRTM 30 m (NASA / USGS, public domain), queried through OpenTopoData (https://www.opentopodata.org/).

Adaptation: the route is resampled, its bends unbent into the game's road along one axis and its heights smoothed (see `tools/routes/build.py`); the buildings are reduced to rectangles with a height and kind, and both they and the ponds are placed in the road's frame.
