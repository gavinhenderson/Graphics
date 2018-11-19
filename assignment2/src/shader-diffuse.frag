#version 300 es

precision mediump float;
in vec4 fcolour;
in vec3 lighting;
in vec2 ftexcoord;

out vec4 outputColor;

uniform int colourMode;
uniform sampler2D texSampler;

void main()
{
  vec4 colour;
  if(colourMode == 1) {
    colour = texture(texSampler, ftexcoord);
  } else {
    colour = vec4(1,1,1,1);
  }

	outputColor = colour * vec4(lighting,1);
}
