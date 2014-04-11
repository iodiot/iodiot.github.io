attribute vec4 tangent;

const int MAX_LIGHTS = 6;

uniform vec3 lightPositions[MAX_LIGHTS];

varying vec2 vUv;
varying vec3 vPosition;

varying vec3 tsPosition;
varying vec3 tsCameraPosition;
varying vec3 tsLightPositions[MAX_LIGHTS];

void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

	vUv = uv;
	vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;

	vec3 vNormal = normalize((modelViewMatrix * vec4(normal, 0.0)).xyz);
	vec3 vTangent = normalize((modelViewMatrix * vec4(tangent.xyz, 0.0)).xyz);
	vec3 vBinormal = normalize(cross(vTangent, vNormal) * tangent.w);

	mat3 tbn = mat3(vTangent, vBinormal, vNormal);

	tsPosition = vPosition * tbn;
	tsCameraPosition = (viewMatrix * vec4(cameraPosition, 1.0)).xyz * tbn;

	for (int i = 0; i < MAX_LIGHTS; ++i) {
		tsLightPositions[i] = (viewMatrix * vec4(lightPositions[i], 1.0)).xyz * tbn;
	}
}
