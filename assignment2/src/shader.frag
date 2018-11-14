#version 300 es

precision mediump float;
in vec4 fcolour;
in vec3 lighting;
out vec4 outputColor;

void main()
{
	outputColor = fcolour * vec4(lighting,1);
}
