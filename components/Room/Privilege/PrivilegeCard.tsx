import { ButtonProps } from '@/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/ui/Card';

import { PrivilegeButton } from '@/components/Room/Privilege/PrivilegeButton';

export interface Props {
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
      <CardHeader>
        <CardTitle>{heading}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{description}</p>
      </CardContent>
      <CardFooter>
        <PrivilegeButton
          roomName={roomName}
          privilege={privilege}
          buttonText={buttonText}
          variant={buttonVariant}
        />
      </CardFooter>
    </Card>
  );
}
