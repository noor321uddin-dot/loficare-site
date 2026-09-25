# WebGL hero tier benchmark (decision D3)

Run 2026-09-25T21:06:57.352Z against http://127.0.0.1:4399. Headless Chrome, 1024 by 768, CPU throttled 4x. Renderer: ANGLE (AMD, AMD Radeon(TM) Graphics (0x000013C0) Direct3D11 vs_5_0 ps_5_0, D3D11).

- Tier chosen at runtime: webgl
- Frame rate while the assembly plays (first 2 s of sampling): 240, 240, 202, 184 fps, average 217
- Frame rate at idle (next 3 s): 189, 202, 221, 192, 228, 225 fps, average 210
- Assembly timeline progress at the end of sampling: n/a
- Pass threshold: 50 fps in both windows with the WebGL tier active. Result: PASS

Captures: docs/screens/hero-webgl-1024.png and hero-webgl-1440.png.
The runtime keeps its own guard: the island bows out on any device that renders under 42 fps in its first half second, and never loads under 768 px, under reduced motion, with less than 4 GB of device memory, or without WebGL2.
