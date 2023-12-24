import { BrButton, BrMessage, BrDivider, BrAvatar, BrCard, Container, Typography, BrList, BrItem, BrTag, BrLoading, BrCheckboxGroup, BrCheckbox, BrTextarea, BrInput, Row } from "@govbr-ds/react-components";
import { DateTimePicker } from "@/app/_ui/components";
import MagicButton from "@/app/_ui/components/magicButton/MagicButton";

export default function Home() {
  return <>
      <BrAvatar title="User" type="image" size="large" src="https://github.com/adeirjunior.png" />
      <BrMessage type={"success"} message="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nulla placeat quaerat qui doloribus, porro expedita quidem animi iure ratione temporibus!" />
      <BrButton>Botão Teste</BrButton>
      <MagicButton />
      <Row>
        <BrTag icon="book" size="large" type="text" value="livros" />
        <BrTag icon="car" size="large" type="text" value="carros" />
        <BrTag icon="house" size="large" type="text" value="casas" />
        <BrTag icon="person" size="large" type="text" value="pessoas" />
      </Row>
      <BrInput label="Nome" type="text" hasIcon placeholder="joão paulo..." />
      <BrLoading />
      <BrCheckboxGroup inline info="Lorem ipsum dolor. Lorem ipsum dolor sit amet consectetur, adipisicing elit." title="Sim ou Não?">
        <BrCheckbox autoFocus label="Sim" value="sim" />
        <BrCheckbox label="Não" value="nao" />
      </BrCheckboxGroup>
      <DateTimePicker />
      <BrTextarea label="Conteúdo" placeholder="Escreva aqui..." density="large" />
      <BrCard>
        <Container>
          <Typography htmlElement="h2">Lorem ipsum dolor.</Typography>
          <BrDivider />
          <Typography htmlElement="p" margin={4}>Lorem ipsum dolor. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus, esse?</Typography>
          <BrList title="Lista">
            {[...Array(8)].map((item, index) => {
              return (
                <BrItem key={index} role="listitem">Item {index + 1}</BrItem>
              )
            })}
          </BrList>
        </Container>
      </BrCard>
  </>
}
