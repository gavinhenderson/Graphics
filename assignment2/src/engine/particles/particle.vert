#version 300 es

precision mediump float;

layout(location = 1) in float lifetime;
layout(location = 2) in vec3 offsetFromCenter;
layout(location = 3) in vec2 vertex;

uniform vec3 startingPos;
uniform mat4 projection, model, view;
uniform float currentTime;

void main(){
  float currentPointInCycle = mod(currentTime, lifetime);
  vec4 position = vec4(currentPointInCycle+vertex.x, currentPointInCycle+vertex.y, currentPointInCycle, 1);
  // position.xy += vertex.xy;

  mat4 modelview = view * model;
  vec4 vertPos4 = projection * modelview * position;

  gl_Position = vertPos4;

  /*
  float velocity = 1.0;
  // float size = (lifetime * lifetime) * 0.05;
  // size = 0.001;
  float size = (4.0*4.0) * 0.05;

  bool billboarding = false;
  vec4 position = vec4(startingPos + offsetFromCenter + (currentPointInCycle * velocity),1.0);

  if(billboarding == true){
    vec3 cameraRight = vec3(
      view[0].x, view[1].x, view[2].x
    );
    vec3 cameraUp = vec3(
      view[0].y, view[1].y, view[2].y
    );

    position.xyz += (cameraRight * vertex.x * size) +
     (cameraUp * vertex.y * size);
  } else {
    position.xy += vertex.xy;
  }

  mat4 modelview = view * model;

  vec4 vertPos4 = projection * modelview * position;

  gl_Position = vertPos4;
  */
}