import { Card,
    CardHeader,
    CardBody,
    CardFooter,
    Stack,
    Heading,
    Button,
    Text,
    Image} from '@chakra-ui/react';


export default function CardWithJobPost({id, title, requirements, salary, description}){
    return(
        <Card
            width="90%"
            direction={{ base: 'column', sm: 'row' }}
            overflow='hidden'
            variant='outline'
        >


            <Stack>
                <CardBody>
                    <Heading size='md'>{title}</Heading>

                    <Text py='2'>
                        Requirements: {requirements}
                    </Text>

                    <Text py='2'>
                        Salary: {salary} PLN
                    </Text>

                    <Text py='2'>
                        {description}
                    </Text>
                </CardBody>

                <CardFooter>
                    <Button variant='solid' colorScheme='blue'>
                        Apply for the job
                    </Button>
                </CardFooter>
            </Stack>
        </Card>
    )

}
