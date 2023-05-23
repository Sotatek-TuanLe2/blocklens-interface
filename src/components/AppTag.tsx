import 'src/styles/components/AppTag.scss';

interface ITag {
  value: string;
  variant?: 'sm' | 'md';
  selected?: boolean;
  onClick?: (value: string) => void;
}

const AppTag: React.FC<ITag> = (props) => {
  const { value, variant = 'sm', selected = false, onClick } = props;

  const onClickTag = () => {
    if (onClick) {
      onClick(value);
    }
    return;
  };

  return (
    <div
      className={`app-tag app-tag--${variant} ${
        onClick ? 'app-tag--clickable' : ''
      } ${selected ? 'app-tag--selected' : ''}`}
      onClick={onClickTag}
    >
      #{value}
    </div>
  );
};

export default AppTag;
