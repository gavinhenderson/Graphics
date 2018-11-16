#version 300 es

precision mediump float;
in vec4 fcolour;
in vec3 lighting;
in vec2 ftexcoord;
out vec4 outputColor;

uniform sampler2D texSampler;

void main()
{
  vec4 texColour = texture(texSampler, ftexcoord);

	outputColor = texColour * vec4(lighting,1);
}
