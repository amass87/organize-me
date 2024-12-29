import useThemeStore from '../../store/themeStore';

export function ThemeWrapper({ children, className = '' }) {
  const { colors } = useThemeStore(state => state.getTheme());
  return (
    <div className={`transition-colors duration-200 ${colors.text} ${className}`}>
      {children}
    </div>
  );
}
