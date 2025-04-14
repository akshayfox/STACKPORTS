export interface NavItemProps {
    to: string;
    icon: JSX.Element;
    label: string;
    isActive?: boolean;
    badge?: number;
  }