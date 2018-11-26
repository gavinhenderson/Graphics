#version 300 es

precision mediump float;

in vec3 normalInterp;
in vec3 vertPos;
in vec2 ftexcoord;

out vec4 fragColor;

uniform vec3 lightPos;

// 1 is on
// 0 is off
uniform float lightPower;

const vec3 lightColor = vec3(1.0, 1.0, 1.0);
const vec3 diffuseColor = vec3(1.0, 1.0, 1.0);
const vec3 specColor = vec3(1.0, 1.0, 1.0);
const float shininess = 16.0;

uniform int colourMode;
uniform int lightingMode;
uniform sampler2D texSampler;

vec3 getLight(vec3 ambientColor) {
  vec3 normal = normalize(normalInterp);
  vec3 lightDir = lightPos - vertPos;
  float distance = length(lightDir);
  distance = distance * distance;
  lightDir = normalize(lightDir);

  float lambertian = max(dot(lightDir,normal), 0.0);
  float specular = 0.0;

  if(lambertian > 0.0) {
    vec3 viewDir = normalize(-vertPos);

    // this is blinn phong
    vec3 halfDir = normalize(lightDir + viewDir);
    float specAngle = max(dot(halfDir, normal), 0.0);
    specular = pow(specAngle, shininess);
  }

  vec3 colorLinear = ambientColor +
                     diffuseColor * lambertian * lightColor * lightPower / distance +
                     specColor * specular * lightColor * lightPower / distance;

  return colorLinear;

}

void main()
{
  vec3 ambientColor;
  if(colourMode == 1) {
    ambientColor = texture(texSampler, ftexcoord).xyz;
  } else {
    ambientColor = vec3(1.0, 0.0, 0.0);
  }

  vec3 colorLinear;
  if(lightingMode == 1) {
    colorLinear = getLight(ambientColor);
  } else {
    colorLinear = ambientColor;
    if(lightPower == 0.0) {
      colorLinear = ambientColor * 0.5;
    }
  }

  fragColor = vec4(colorLinear, 1.0);
}