import { useState } from "react";
import { Alert, Keyboard, Text, View } from "react-native";
import {
  PlusIcon,
  Tag,
  Calendar as IconCalendar,
  Clock,
} from "lucide-react-native";

import { TripData } from "./[id]";
import { Button } from "@/components/button";
import { colors } from "@/styles/colors";
import { Modal } from "@/components/modal";
import { Input } from "@/components/input";
import { Calendar } from "@/components/calendar";
import dayjs from "dayjs";
import { activitiesServer } from "@/server/activities-server";

type Props = {
  tripDetails: TripData;
};

enum MODAL {
  NONE = 0,
  CALENDAR = 1,
  NEW_ACTIVITY = 2,
}

export function Activities({ tripDetails }: Props) {
  //MODAL
  const [showModal, setShowModal] = useState(MODAL.NONE);

  //LOADING
  const [isCreatingActivity, setIsCreatingActivity] = useState(false);

  //DATA
  const [activityTitle, setActivityTitle] = useState("");
  const [activityDate, setActivityDate] = useState("");
  const [activityHour, setActivityHour] = useState("");

  function resetNewActivityFields(){
    setActivityTitle("")
    setActivityDate("")
    setActivityHour("")
    setShowModal(MODAL.NONE)
  }

  async function handleCreateTripActivity() {
    try {
      if (!activityTitle || !activityDate || !activityHour) {
        return Alert.alert("Cadastrar atividade", "Preencha todos os campos!");
      }
      setIsCreatingActivity(true);

      await activitiesServer.create({
        tripId: tripDetails.id,
        occurs_at: dayjs(activityDate).add(Number(activityHour), "h").toString(),
        title: activityTitle
      })

      Alert.alert("Nova atividade", "Nova atividade cadastrada com sucesso!")
      resetNewActivityFields()

    } catch (error) {
      console.log(error);
    } finally {
      setIsCreatingActivity(false);
    }
  }

  return (
    <View className="flex-1">
      <View className="w-full flex-row mt-5 mb-6 pt-5 pb-6 items-center">
        <Text className="text-white text-2xl font-semibold flex-1">
          Atividades
        </Text>

        <View className="flex-1">
          <Button onPress={() => setShowModal(MODAL.NEW_ACTIVITY)}>
            <PlusIcon color={colors.lime[950]} />
            <Button.Title>Nova atividade</Button.Title>
          </Button>
        </View>
      </View>

      <Modal
        visible={showModal == MODAL.NEW_ACTIVITY}
        title="Cadastrar atividade"
        subtitle="Todos os convidados podem visualizar as atividades."
        onClose={() => setShowModal(MODAL.NONE)}
      >
        <View className="mt-4 mb-3">
          <Input variant="secondary">
            <Tag color={colors.zinc[400]} size={20} />
            <Input.Field
              placeholder="Qual atividade?"
              onChangeText={setActivityTitle}
              value={activityTitle}
            />
          </Input>

          <View className="w-full flex-row gap-3">
            <View className="flex-1 mt-3 flex-row gap-2 ">
              <Input variant="secondary" className="flex-1">
                <IconCalendar color={colors.zinc[400]} size={20} />
                <Input.Field
                  placeholder="Data?"
                  onChangeText={setActivityDate}
                  value={
                    activityDate
                      ? dayjs(activityDate).format("DD [de] MMMM")
                      : ""
                  }
                  onFocus={() => Keyboard.dismiss}
                  showSoftInputOnFocus={false}
                  onPressIn={() => setShowModal(MODAL.CALENDAR)}
                />
              </Input>
            </View>

            <View className="flex-1 mt-3 flex-row gap-2">
              <Input variant="secondary" className="flex-1">
                <Clock color={colors.zinc[400]} size={20} />
                <Input.Field
                  placeholder="Horário?"
                  onChangeText={(text) =>
                    setActivityHour(text.replace(".", "").replace(",", ""))
                  }
                  value={activityHour}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </Input>
            </View>
          </View>
          <View className="mt-4">
          <Button onPress={handleCreateTripActivity} isLoading={isCreatingActivity}>
            <Button.Title>Salvar atividade</Button.Title>
          </Button>

          </View>
        </View>
      </Modal>

      <Modal
        title="Selecionar datas"
        subtitle="Selecione a data da atividade"
        visible={showModal === MODAL.CALENDAR}
        onClose={() => setShowModal(MODAL.NONE)}
      >
        <View className="gap-4 mt-4">
          <Calendar
            onDayPress={(day) => setActivityDate(day.dateString)}
            markedDates={{ [activityDate]: { selected: true } }}
            initialDate={tripDetails.starts_at.toString()}
            minDate={tripDetails.starts_at.toString()}
            maxDate={tripDetails.ends_at.toString()}
          />
          <Button onPress={() => setShowModal(MODAL.NEW_ACTIVITY)}>
            <Button.Title>Confirmar</Button.Title>
          </Button>
        </View>
      </Modal>
    </View>
  );
}
