import BaseSvgComponent from "@/app/components/logos/BaseSvgComponent";
import { LogoProps } from "@/app/types/svg";

export default function Build({
  className,
  color,
  preserveAspectRatio = "xMidYMid meet",
}: LogoProps) {
  return (
    <BaseSvgComponent
      className={className}
      viewBox="0 0 481 481"
      preserveAspectRatio={preserveAspectRatio}
    >
      <path d="M99.3 134.6L99.3 346.4H64L64 134.6H99.3Z" fill={color} />
      <path
        d="M205.2 134.6L205.2 346.4H169.9L169.9 134.6H205.2Z"
        fill={color}
      />
      <path d="M311.1 169.9V222.85H275.8V169.9H311.1Z" fill={color} />
      <path d="M311.1 258.15V311.1H275.8V258.15H311.1Z" fill={color} />
      <path d="M275.8 134.6V169.9H205.2V134.6H275.8Z" fill={color} />
      <path d="M275.8 222.85V258.15H205.2V222.85H275.8Z" fill={color} />
      <path d="M275.8 311.1V346.4H205.2L205.2 311.1H275.8Z" fill={color} />
      <path d="M134.6 99.3V134.6L99.3 134.6V99.3H134.6Z" fill={color} />
      <path d="M381.7 99.3V134.6L346.4 134.6V99.3H381.7Z" fill={color} />
      <path d="M134.6 346.4V381.7H99.3L99.3 346.4H134.6Z" fill={color} />
      <path d="M381.7 346.4V381.7H346.4V346.4H381.7Z" fill={color} />
      <path d="M346.4 381.7V417H134.6V381.7H346.4Z" fill={color} />
      <path d="M346.4 64V99.3H134.6V64L346.4 64Z" fill={color} />
      <path d="M417 134.6V346.4H381.7V134.6L417 134.6Z" fill={color} />
    </BaseSvgComponent>
  );
}
