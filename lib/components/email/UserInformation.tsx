import { User } from "@prisma/client";
import { Column, Row, Section, Text } from "@react-email/components";

type OrderInformationProps = {
    user: User;
};

export function UserInformation({ user }: OrderInformationProps) {
    return (
        <>
            <Section>
                <Row>
                    <Column>
                        <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
                            Name
                        </Text>
                        <Text className="mt-0 mr-4">{user.name}</Text>
                    </Column>
                    <Column>
                        <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
                            Email
                        </Text>
                        <Text className="mt-0 mr-4">{user.email}</Text>
                    </Column>
                </Row>
            </Section>
        </>
    );
}
