import { Profiles as ProfilesProps } from "@/payload-types";

export const ProfilesBlock = (props: ProfilesProps) => {
  const { title, config } = props;

  return (
    <div>
      <h2>{title}</h2>
      {config && <p>{config}</p>}
    </div>
  );
};
