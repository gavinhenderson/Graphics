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
  
  float velocity = 1.0;
  float size = 0.001;

  bool billboarding = true;
  vec3 origin = vec3(startingPos + offsetFromCenter);

  // this.z = Math.cos(theta) * this.radius;
  // this.x = Math.sin(theta) * this.radius;

  float angle = currentPointInCycle * 18.0;
  float radius = 8.0;

  float currentX = cos(radians(angle)) * radius;
  float currentY = sin(radians(angle)) * radius;
  vec3 arc = vec3(currentX, currentY, 0.0);


  /*
  float currentY;
  if(currentPointInCycle >= 5.0) {
    currentY = abs(currentPointInCycle-10.0);
  } else {
    currentY = currentPointInCycle;
  }
  vec3 arc = vec3(currentPointInCycle, currentY/4.0, 0);
  */

  vec4 position = vec4(arc + origin,1.0);

  vec3 cameraRight = vec3(
    view[0].x, view[1].x, view[2].x
  );
  vec3 cameraUp = vec3(
    view[0].y, view[1].y, view[2].y
  );

  position.xyz += (cameraRight * vertex.x * size) +
    (cameraUp * vertex.y * size);
  
  position.x += vertex.x;
  position.y += vertex.y;

  mat4 modelview = view * model;

  vec4 vertPos4 = projection * modelview * position;

  gl_Position = vertPos4 * size;
  
}