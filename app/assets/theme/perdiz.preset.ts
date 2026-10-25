import { definePreset } from '@primevue/themes'
import Aura from '@primevue/themes/aura'

/**
 * Preset de tema da Perdiz (ADR-005): mapeia os tokens de marca
 * definidos em app/assets/css/main.css para os tokens semânticos
 * do PrimeVue. Fonte única de verdade visual dos componentes.
 * v1 é light-only (ADR-006) — colorScheme.dark adiado.
 */
export default definePreset(Aura, {
  primitive: {
    borderRadius: {
      xs: '0.25rem',
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
    },
  },
  semantic: {
    typography: {
      fontFamily: '"Avenir Next", Avenir, "Trebuchet MS", sans-serif',
    },
    primary: {
      50: '#faf0ec',
      100: '#f3ddd3',
      200: '#e6bba8',
      300: '#d69277',
      400: '#c4644a',
      500: '#a33f24',
      600: '#93381f',
      700: '#7a2e1a',
      800: '#612516',
      900: '#4d1d12',
      950: '#2b110a',
      color: '{primary.500}',
      contrastColor: '#faf7f0',
      hoverColor: '{primary.400}',
      activeColor: '{primary.600}',
    },
    focusRing: {
      color: '{primary.500}',
      width: '2px',
      style: 'solid',
      offset: '2px',
    },
    colorScheme: {
      light: {
        surface: {
          0: '#fcfbf7',
          50: '#f7f4ec',
          100: '#f3f0e7',
          200: '#e8e4d5',
          300: '#d1d3c5',
          400: '#b4b8a6',
          500: '#8b9078',
          600: '#566050',
          700: '#434c3e',
          800: '#26372b',
          900: '#1d2a21',
          950: '#131b15',
        },
        text: {
          color: '{surface.800}',
          hoverColor: '{surface.950}',
          mutedColor: '{surface.600}',
          hoverMutedColor: '{surface.700}',
        },
        content: {
          background: '{surface.0}',
          hoverBackground: '{surface.50}',
          borderColor: '{surface.300}',
          borderRadius: '{border.radius.sm}',
        },
        formField: {
          background: '{surface.0}',
          borderColor: '{surface.300}',
          hoverBorderColor: '{surface.500}',
          focusBorderColor: '{primary.500}',
          borderRadius: '{border.radius.sm}',
        },
        highlight: {
          background: '{primary.50}',
          focusBackground: '{primary.100}',
          color: '{primary.700}',
          focusColor: '{primary.800}',
        },
      },
    },
  },
})
