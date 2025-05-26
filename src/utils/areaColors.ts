
// Sistema de cores por área de estudo
export interface AreaColorScheme {
  primary: string;
  secondary: string;
  text: string;
  bg: string;
  border: string;
  hover: string;
}

export const areaColors: Record<string, AreaColorScheme> = {
  'Direito Constitucional': {
    primary: 'bg-blue-600',
    secondary: 'bg-blue-500', 
    text: 'text-blue-400',
    bg: 'bg-blue-900/20',
    border: 'border-blue-500',
    hover: 'hover:bg-blue-700'
  },
  'Direito Civil': {
    primary: 'bg-green-600',
    secondary: 'bg-green-500',
    text: 'text-green-400', 
    bg: 'bg-green-900/20',
    border: 'border-green-500',
    hover: 'hover:bg-green-700'
  },
  'Direito Penal': {
    primary: 'bg-red-600',
    secondary: 'bg-red-500',
    text: 'text-red-400',
    bg: 'bg-red-900/20', 
    border: 'border-red-500',
    hover: 'hover:bg-red-700'
  },
  'Direito Processual Civil': {
    primary: 'bg-purple-600',
    secondary: 'bg-purple-500',
    text: 'text-purple-400',
    bg: 'bg-purple-900/20',
    border: 'border-purple-500', 
    hover: 'hover:bg-purple-700'
  },
  'Direito Processual Penal': {
    primary: 'bg-orange-600',
    secondary: 'bg-orange-500',
    text: 'text-orange-400',
    bg: 'bg-orange-900/20',
    border: 'border-orange-500',
    hover: 'hover:bg-orange-700'
  },
  'Ética Profissional': {
    primary: 'bg-pink-600',
    secondary: 'bg-pink-500',
    text: 'text-pink-400',
    bg: 'bg-pink-900/20',
    border: 'border-pink-500',
    hover: 'hover:bg-pink-700'
  },
  'Direito do Trabalho': {
    primary: 'bg-indigo-600',
    secondary: 'bg-indigo-500',
    text: 'text-indigo-400',
    bg: 'bg-indigo-900/20',
    border: 'border-indigo-500',
    hover: 'hover:bg-indigo-700'
  },
  'Direito Tributário': {
    primary: 'bg-yellow-600',
    secondary: 'bg-yellow-500',
    text: 'text-yellow-400',
    bg: 'bg-yellow-900/20',
    border: 'border-yellow-500',
    hover: 'hover:bg-yellow-700'
  },
  'Direito Administrativo': {
    primary: 'bg-teal-600',
    secondary: 'bg-teal-500',
    text: 'text-teal-400',
    bg: 'bg-teal-900/20',
    border: 'border-teal-500',
    hover: 'hover:bg-teal-700'
  }
};

export const getAreaColors = (area: string): AreaColorScheme => {
  return areaColors[area] || {
    primary: 'bg-gray-600',
    secondary: 'bg-gray-500',
    text: 'text-gray-400',
    bg: 'bg-gray-900/20',
    border: 'border-gray-500',
    hover: 'hover:bg-gray-700'
  };
};
