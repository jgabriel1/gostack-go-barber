import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Platform, Alert } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Feather'
import DateTimePicker from '@react-native-community/datetimepicker'
import { format } from 'date-fns'

import { useAuth } from '../../hooks/auth'
import api from '../../services/api'

import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  Content,
  ProvidersListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  CalendarTitle,
  ShowDatePickerButton,
  ShowDatePickerButtonText,
  Schedule,
  ScheduleTitle,
  Section,
  SectionTitle,
  SectionContent,
  TimeSlot,
  TimeSlotText,
  CreateAppointmentButton,
  CreateAppointmentButtonText,
} from './styles'

interface RouteParams {
  providerId: string
}

export interface Provider {
  id: string
  name: string
  avatar_url: string
}

interface AvailabilityItem {
  hour: number
  available: boolean
}

const CreateAppointment: React.FC = () => {
  const { user } = useAuth()

  const route = useRoute()
  const routeParams = route.params as RouteParams

  const navigation = useNavigation()

  const [providers, setProviders] = useState<Provider[]>([])
  const [selectedProvider, setSelectedProvider] = useState(
    routeParams.providerId,
  )

  const [availability, setAvailability] = useState<AvailabilityItem[]>([])
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(0)

  useEffect(() => {
    api.get('providers').then(response => {
      setProviders(response.data)
    })
  }, [])

  useEffect(() => {
    api
      .get(`providers/${selectedProvider}/day-availability`, {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(response => {
        setAvailability(response.data)
      })
  }, [selectedDate, selectedProvider])

  const navigateBack = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  const handleSelectProvider = useCallback((providerId: string) => {
    setSelectedProvider(providerId)
  }, [])

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker(current => !current)
  }, [])

  const handleDateChanged = useCallback((_, date?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false)
    if (date) setSelectedDate(date)
  }, [])

  const handleSelectTimeSlot = useCallback((hour: number) => {
    setSelectedTimeSlot(hour)
  }, [])

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate)

      date.setHours(selectedTimeSlot)
      date.setMinutes(0)

      await api.post('appointments', {
        provider_id: selectedProvider,
        date,
      })

      navigation.navigate('AppointmentCreated', { date: date.getTime() })
    } catch (error) {
      Alert.alert(
        'Erro ao criar o agendamento.',
        'Ocorreu um erro ao tentar criar o agendamento, tente novamente.',
      )
    }
  }, [navigation, selectedDate, selectedProvider, selectedTimeSlot])

  const morningAvailability = useMemo(
    () =>
      availability
        .filter(({ hour }) => hour < 12)
        .map(({ hour, available }) => ({
          hour,
          available,
          formattedHour: format(new Date().setHours(hour), 'HH:00'),
        })),
    [availability],
  )

  const afternoonAvailability = useMemo(
    () =>
      availability
        .filter(({ hour }) => hour >= 12)
        .map(({ hour, available }) => ({
          hour,
          available,
          formattedHour: format(new Date().setHours(hour), 'HH:00'),
        })),
    [availability],
  )

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Cabeleireiros</HeaderTitle>

        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>

      <Content>
        <ProvidersListContainer>
          <ProvidersList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={providers}
            keyExtractor={provider => provider.id}
            renderItem={({ item: provider }) => (
              <ProviderContainer
                onPress={() => handleSelectProvider(provider.id)}
                selected={provider.id === selectedProvider}
              >
                <ProviderAvatar source={{ uri: provider.avatar_url }} />

                <ProviderName selected={provider.id === selectedProvider}>
                  {provider.name}
                </ProviderName>
              </ProviderContainer>
            )}
          />
        </ProvidersListContainer>

        <Calendar>
          <CalendarTitle>Escolha a data:</CalendarTitle>

          <ShowDatePickerButton onPress={handleToggleDatePicker}>
            <ShowDatePickerButtonText>
              Selecionar outra data
            </ShowDatePickerButtonText>
          </ShowDatePickerButton>

          {showDatePicker && (
            <DateTimePicker
              mode="date"
              display="calendar"
              onChange={handleDateChanged}
              value={selectedDate}
            />
          )}
        </Calendar>

        <Schedule>
          <ScheduleTitle>Escolha o horário</ScheduleTitle>

          <Section>
            <SectionTitle>Manhã</SectionTitle>

            <SectionContent>
              {morningAvailability.map(({ formattedHour, hour, available }) => (
                <TimeSlot
                  enabled={available}
                  selected={selectedTimeSlot === hour}
                  available={available}
                  key={formattedHour}
                  onPress={() => handleSelectTimeSlot(hour)}
                >
                  <TimeSlotText selected={selectedTimeSlot === hour}>
                    {formattedHour}
                  </TimeSlotText>
                </TimeSlot>
              ))}
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Tarde</SectionTitle>

            <SectionContent>
              {afternoonAvailability.map(
                ({ formattedHour, hour, available }) => (
                  <TimeSlot
                    enabled={available}
                    selected={selectedTimeSlot === hour}
                    available={available}
                    key={formattedHour}
                    onPress={() => handleSelectTimeSlot(hour)}
                  >
                    <TimeSlotText selected={selectedTimeSlot === hour}>
                      {formattedHour}
                    </TimeSlotText>
                  </TimeSlot>
                ),
              )}
            </SectionContent>
          </Section>
        </Schedule>

        <CreateAppointmentButton onPress={handleCreateAppointment}>
          <CreateAppointmentButtonText>Agendar</CreateAppointmentButtonText>
        </CreateAppointmentButton>
      </Content>
    </Container>
  )
}

export default CreateAppointment
