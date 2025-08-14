import {
  Container,
  Title,
  Text,
  Button,
  Accordion,
  AccordionItem,
  AccordionControl,
  AccordionPanel,
  Group,
  Image,
  Badge,
  Avatar,
  Stack,
  List,
  ListItem,
  ThemeIcon,
  Card,
  Divider,
} from "@mantine/core";
import { IconCircleCheck, IconStar } from "@tabler/icons-react";

export default async function CoursePage() {

    const res = await fetch(
    "https://api.eduelle.com/api/landingPageDetails?final_url=the-bodys-wisdom-free-the-tension-b&domain=https:%2F%2Feduelle.com",
    { cache: "no-store" } // ensures fresh data every time
  );

  if (!res.ok) {
    throw new Error("Failed to fetch course data");
  }

  const data = await res.json();
  const courseData = data?.data?.landing_page_translations[0] as any

  return (
    <Container size="lg" py="xl">
      {/* Video & Title */}
      <Card withBorder radius="md" mb="lg" shadow="sm" p="md">
        <Image
          src="https://coursemarketplace2025.s3.amazonaws.com/intro-thumbnail/1750091793423-the_bodys_wisdom.jpeg" // Replace with actual video preview image
          alt="Course Preview"
          radius="md"
        />
        <Title order={2} mt="md">
          {data?.data?.landing_page_translations[0]?.header}
        </Title>
        <Group mt="sm">
          <Badge color="yellow" size="lg" leftSection={<IconStar size={16} />}>
            5.0 / 1827 reviews
          </Badge>
        </Group>
      </Card>

      {/* Guarantee */}
      <Card withBorder radius="md" mb="xl" p="md" bg="green.0">
        <Text fw={500}>💰 Money-Back Guarantee</Text>
        <Text size="sm" c="dimmed">
          If within 14 days you feel the course isn’t right for you, we’ll refund your payment —
          no questions asked. Email{" "}
          <Text span fw={500} c="blue">
            support@eduelle.com
          </Text>
        </Text>
      </Card>

      {/* Reviews */}
      <Title order={3} mb="sm">
        Reviews
      </Title>
      {courseData?.comments?.map?.((item:any)=>{
        return (
<Card withBorder radius="md" p="md" mb="xl">
        <Group>
          <Avatar src="/reviewer.jpg" radius="xl" />
          <Stack gap={0}>
            <Text fw={500}>{item?.name}</Text>
            <Group gap={2}>
              {[...Array(5)].map((_, i) => (
                <IconStar key={i} size={14} color="gold" />
              ))}
            </Group>
          </Stack>
        </Group>
        <Text mt="sm">
          {item?.comment_text}
        </Text>
      </Card>
        )
      })

      }


      {/* What You Get */}
      <Title order={3} mb="sm">
        What You Get
      </Title>
      <List
        spacing="sm"
        size="sm"
        icon={
          <ThemeIcon color="green" size={20} radius="xl">
            <IconCircleCheck size={14} />
          </ThemeIcon>
        }
        mb="xl"
      >
         <ListItem>6 video lessons</ListItem>
  <ListItem>Lifetime access to all course materials</ListItem>
      </List>

      {/* How We'll Make It Happen */}
      <Title order={3} mb="sm">
        How We’ll Make It Happen
      </Title>
      <List spacing="sm" size="sm" mb="xl">
        {courseData?.landing_page_lessons?.map?.((item:any)=>{
          return(
 <ListItem>
          <Text fw={500}>{item?.ap_title}</Text>
          {item?.ap_description}
        </ListItem>
          )
        })

        }


      </List>

      {/* Course Plan */}
      <Title order={3} mb="sm">
        Course Plan
      </Title>
      <Accordion multiple>
        <AccordionItem value="lesson1">
          <AccordionControl>Lesson 1. Feel the Embrace – Grounding</AccordionControl>
          <AccordionPanel>Lesson description...</AccordionPanel>
        </AccordionItem>
        <AccordionItem value="lesson2">
          <AccordionControl>Lesson 2. Move with Meaning – Somatic Flow</AccordionControl>
          <AccordionPanel>Lesson description...</AccordionPanel>
        </AccordionItem>
        <AccordionItem value="lesson3">
          <AccordionControl>Lesson 3. Calm the Storm – Nervous System Regulation</AccordionControl>
          <AccordionPanel>Lesson description...</AccordionPanel>
        </AccordionItem>
      </Accordion>

      {/* Author */}
      <Divider my="xl" />
      <Group align="flex-start" mb="xl">
        <Avatar src="/author.jpg" size="lg" radius="xl" />
        <Stack gap={0}>
          <Text fw={500}>Desi Tess</Text>
          <Text size="sm" c="dimmed">
            Somatic guide, yoga teacher, and emotional wellness coach.
          </Text>
        </Stack>
      </Group>

      {/* CTA */}
      <Button size="lg" color="green" fullWidth>
        Join Now – $19 (90% Off)
      </Button>
    </Container>
  );
}
