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
const float shininess = 0.1;

uniform int colourMode;
uniform int lightingMode;
uniform sampler2D texture1;
uniform sampler2D texture2;

vec3 getLight(vec3 ambientColor, vec3 normalMapCurrent) {
  vec3 normal = normalize(normalInterp) * normalMapCurrent;
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
  vec3 normalMapCurrent = vec3(1,1,1);

  if(colourMode == 1) {
    ambientColor = texture(texture1, ftexcoord).xyz;
  } else if (colourMode == 2) {
    if(lightPower == 0.0) {
      ambientColor = vec3(1.0, 0.98, 0.46);
    } else {
      ambientColor = vec3(1.0, 0.96, 0.0);
    }
  } else if (colourMode == 3) {
    ambientColor = texture(texture1, ftexcoord).xyz;
    vec3 normalMapTex = texture(texture2, ftexcoord).xyz;
    normalMapCurrent = normalMapTex.rgb * 2.0 - 1.0;
  }

  vec3 colorLinear;
  if(lightingMode == 1) {
    colorLinear = getLight(ambientColor, normalMapCurrent);
  } else {
    colorLinear = ambientColor;
    if(lightPower == 0.0) {
      colorLinear = ambientColor * 0.5;
    }
  }

  fragColor = vec4(colorLinear, 1.0);
}