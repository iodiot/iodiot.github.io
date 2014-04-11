varying vec2 vUv;
uniform sampler2D texture;

void main() {
	vec4 texel =  texture2D(texture, vUv);

	if (texel.a < 0.5) { discard; }

	gl_FragColor = texel;
}