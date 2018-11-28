#version 300 es

precision mediump float;

layout(location = 1) in float lifetime;
layout(location = 2) in vec3 offsetFromCenter;

uniform vec3 startingPos;
uniform mat4 projection, model, view;
uniform float time;

void main(){
  float currentPointInCycle = mod(time, lifetime);
  float velocity = 1.0;

  vec4 position = vec4(startingPos + offsetFromCenter + (currentPointInCycle * velocity),1.0);

  mat4 modelview = view * model;

  vec4 vertPos4 = projection * modelview * position;

  gl_Position = vertPos4;
}