interface IHeaderProps {
  type: string;
  author: string;
  title: string;
}

const Header: React.FC<IHeaderProps> = (props) => {
  const { type, author, title } = props;

  return <div className="workspace-page__editor__header"></div>;
};

export default Header;
