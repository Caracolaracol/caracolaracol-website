interface childrenProps {
  children: JSX.Element | String;
  to: string;
}
function ProjectLink({ children, to }: childrenProps) {
  return (
    <li className="flex w-full cursor-pointer group">
      <a href={to} className="font-tommyRegular text-platinum/80 group-hover:text-violetl antialiased tracking-wide text-sm tablet:text-base laptop:text-base desktop:text-lg">
        {children}
      </a>
    </li>
  );
}

export default ProjectLink;
