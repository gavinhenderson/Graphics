#version 300 es

layout(location = 1) in vec3 position;
layout(location = 2) in vec3 normal;
layout(location = 3) in vec2 texcoord;

uniform mat4 projection, model, view;

out vec3 normalInterp;
out vec3 vertPos;
out vec2 ftexcoord;

void main(){
    ftexcoord = texcoord;

    mat4 modelview = view * model;

    vec4 vertPos4 = projection * modelview * vec4(position, 1.0);
    gl_Position = vertPos4;

    vertPos = vec3(vertPos4.xyz / vertPos4.w);
    normalInterp = normal;
}