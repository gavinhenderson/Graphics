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
const float shininess = 3.0;

uniform int normalMapOn;
uniform int colourMode;
uniform int lightingMode;
uniform sampler2D texture1;
uniform sampler2D texture2;

vec3 getLight(vec3 ambientColor, vec4 normalMapCurrent) {
  vec3 normal = normalize(normalInterp * normalMapCurrent.xyz);
  vec3 lightDir = lightPos - vertPos;
  float distance = length(lightDir);
  distance = distance * distance;
  lightDir = normalize(lightDir);

  float lambertian = max(dot(lightDir,normal), 0.0);
  float specular = 0.0;

  if(lambertian > 0.0) {
    vec3 viewDir = normalize(-vertPos);
    vec3 halfDir = normalize(lightDir + viewDir);
    float specAngle = max(dot(halfDir, normal), 0.0);
    specular = pow(specAngle, shininess);
  }

  float newLightPower = lightPower;

  vec3 colorLinear = ambientColor +
                     diffuseColor * lambertian * lightColor * newLightPower / distance +
                     specColor * specular * lightColor * newLightPower / distance;

  return colorLinear;

}

void main()
{
  vec3 ambientColor;
  vec4 normalMapCurrent = vec4(1,1,1,1);

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
    if(normalMapOn == 1){
      vec4 normal_from_map = texture(texture2, ftexcoord);
      normalMapCurrent = 2.0 * normal_from_map - 1.0;
    }
  }

  vec3 colorLinear;
  if(lightingMode == 1) {
    colorLinear = getLight(ambientColor * 0.6, normalMapCurrent);
    // colorLinear = ambientColor * 0.6;
    if(lightPower == 0.0) {
      colorLinear = ambientColor * 0.1;
    }

  } else {
    colorLinear = ambientColor;
    if(lightPower == 0.0) {
      colorLinear = ambientColor * 0.01;
    }
  }

  fragColor = vec4(colorLinear, 1.0);
}