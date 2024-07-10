import { useEffect, useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { Button } from "@/components/button";
import { Modal } from "@/components/modal";
import { colors } from "@/styles/colors";
import { Plus } from "lucide-react-native";
import { Input } from "@/components/input";
import { validateInput } from "@/utils/validateInput";
import { linksServer } from "@/server/links-server";
import { TripLinkProps, TripLink } from "@/components/tripLink";
import { participantsServer } from "@/server/participants-server";
import { ParticipantProps, Participant } from "@/components/participant";

export function Details({ tripId }: { tripId: string }) {
  //LOADING
  const [isCreatingLink, setIsCreatingLink] = useState(false);

  //MODAL
  const [showNewLinkModal, setShowNewLinkModal] = useState(false);

  //LISTS
  const [links, setLinks] = useState<TripLinkProps[]>([]);
  const [participants, setParticipants] = useState<ParticipantProps[]>([]);

  //DATA
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  function resetNewLinkFields() {
    setLinkTitle("");
    setLinkUrl("");
    setShowNewLinkModal(false);
  }

  async function handleCreateTripLink() {
    try {
      if (!linkTitle.trim()) {
        return Alert.alert("Link", "Informe o título do link.");
      }
      if (!validateInput.url(linkUrl.trim())) {
        return Alert.alert("Link", "Link inválido!");
      }
      setIsCreatingLink(true);

      await linksServer.create({
        tripId,
        title: linkTitle,
        url: linkUrl,
      });

      Alert.alert("Link", "Link cadastrado com sucesso!");
      resetNewLinkFields();
      await getTripLinks();
    } catch (error) {
      console.log(error);
    } finally {
      setIsCreatingLink(false);
    }
  }

  async function getTripLinks() {
    try {
      const links = await linksServer.getLinksByTripId(tripId);
      setLinks(links);
    } catch (error) {
      console.log(error);
    }
  }

  async function getTripParticipants() {
    try {
      const participants = await participantsServer.getByTripId(tripId);
      setParticipants(participants);
      // console.log(participants);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getTripLinks();
    getTripParticipants();
  }, []);

  return (
    <View className="flex-1 py-2">
      <View className="flex-1">
        <Text className="text-white text-2xl font-semibold mb-2 py-2">
          Links Importantes
        </Text>
        {links.length > 0 ? (
          <FlatList
            data={links}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TripLink data={item} />}
            contentContainerClassName="gap-4"
          />
        ) : (
          <Text className="text-zinc-400 font-regular text-base mt-2 pb-2">
            Nenhum link adicionado.
          </Text>
        )}

        <View className="mt-4">
          <Button variant="secondary" onPress={() => setShowNewLinkModal(true)}>
            <Plus color={colors.zinc[200]} size={20} />
            <Button.Title>Cadastrar novo link</Button.Title>
          </Button>
        </View>
      </View>

      <View className="flex-1 border-t border-zinc-800 mt-4">
        <Text className="text-white text-2xl font-semibold mb-2 my-2">
          Convidados
        </Text>

        <FlatList
          data={participants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Participant data={item} />}
          contentContainerClassName="gap-4"
          contentContainerStyle={{ paddingBottom: 44 }}
        />
      </View>

      <Modal
        title="Cadastrar link"
        subtitle="Todos os convidados podem visualizar os links."
        visible={showNewLinkModal}
        onClose={() => setShowNewLinkModal(false)}
      >
        <View className="gap-2 mb-3">
          <Input variant="secondary">
            <Input.Field
              placeholder="Título do link"
              onChangeText={setLinkTitle}
            />
          </Input>
          <Input variant="secondary">
            <Input.Field placeholder="URL" onChangeText={setLinkUrl} />
          </Input>
        </View>
        <View className="mt-4">
          <Button isLoading={isCreatingLink} onPress={handleCreateTripLink}>
            <Button.Title>Salvar Link</Button.Title>
          </Button>
        </View>
      </Modal>
    </View>
  );
}
