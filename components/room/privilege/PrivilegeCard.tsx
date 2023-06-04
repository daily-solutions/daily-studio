import { ButtonProps } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { JoinAsButton } from '@/components/room/privilege/JoinAsButton';

interface Props {
  roomName: string;
  heading: string;
  description: string;
  buttonText: string;
  privilege?: 'producer' | 'presenter' | 'viewer';
  buttonVariant?: ButtonProps['variant'];
}

export function PrivilegeCard({
  roomName,
  heading,
  description,
  buttonText,
  buttonVariant = 'default',
  privilege = 'viewer',
}: Props) {
  return (
    <Card className="flex w-full flex-col justify-between sm:max-w-[40dvh]">
      <CardHeader className="font-bold">{heading}</CardHeader>
      <CardContent>
        <p className="text-sm">{description}</p>
      </CardContent>
      <CardFooter>
        <JoinAsButton
          roomName={roomName}
          privilege={privilege}
          buttonText={buttonText}
          variant={buttonVariant}
        />
      </CardFooter>
    </Card>
  );
}
