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
uniform int isAmbientOn;
uniform sampler2D texture1;

// https://en.wikipedia.org/wiki/Blinn%E2%80%93Phong_shading_model
vec3 getLight(vec3 ambientColor, vec4 normalMapCurrent) {
  vec3 normal = normalize(normalInterp * normalMapCurrent.xyz);
  vec3 direction = lightPos - vertPos;
  float distance = length(direction);
  distance = distance * distance;
  direction = normalize(direction);

  float lambertian = max(dot(direction,normal), 0.0);
  float specular = 0.0;

  if(lambertian > 0.0) {
    vec3 viewDir = normalize(-vertPos);
    vec3 halfDir = normalize(direction + viewDir);
    float specAngle = max(dot(halfDir, normal), 0.0);
    specular = pow(specAngle, shininess);
  }

  float newLightPower = lightPower;

  vec3 lightAdjustedColour = ambientColor +
                     diffuseColor * lambertian * lightColor * newLightPower / distance +
                     specColor * specular * lightColor * newLightPower / distance;

  return lightAdjustedColour;

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
  }

  vec3 finalColour;
  if(lightingMode == 1) {

    

    finalColour = getLight(ambientColor * 0.6, normalMapCurrent);
    if(lightPower == 0.0) {
      float ambientMuliplier = 0.1;

      if(isAmbientOn == 1) ambientMuliplier = 0.8;
      finalColour = ambientColor * ambientMuliplier;
    }

  } else {
    finalColour = ambientColor;
    if(lightPower == 0.0) {
      finalColour = ambientColor * 0.01;
    }
  }

  fragColor = vec4(finalColour, 1.0);
}