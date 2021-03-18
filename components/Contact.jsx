import SocialChip from './SocialChip';
import { socials } from '../config';

function Contact() {
  return (
    <div className="my-12">
      { Object.values(socials).map(({ title, link, iconName }) => (
        <SocialChip
          key={link}
          title={title}
          link={link}
          iconName={iconName}
        />
      ))}
    </div>
  );
}

export default Contact;
