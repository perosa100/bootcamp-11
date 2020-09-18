import React, { useCallback, useState, useEffect, useMemo } from 'react'
import { useRoute, useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Feather'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Platform, Alert } from 'react-native'
import { format } from 'date-fns'
import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  Content,
  ProviderList,
  ProviderListContainer,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
  Calendar,
  Title,
  Schedule,
  Section,
  SectionTitle,
  SectionContainer,
  Hour,
  HourText,
  CreateAppointmentButton,
  CreateAppointmentButtonText
} from './styles'
import { useAuth } from '../../hooks/auth'
import api from '../../services/api'

export interface Provider {
  id: string
  name: string
  avatar_url: string
}
interface RouteParams {
  providerId: string
}

interface availability {
  hour: number
  available: boolean
}
const CreateAppointment: React.FC = () => {
  const route = useRoute()
  const { goBack, navigate } = useNavigation()
  const routeParams = route.params as RouteParams
  const [selectedProvider, setSelectedProvider] = useState(
    routeParams.providerId
  )
  const [showDatePicker, setShowDatePicker] = useState(false)
  const { user } = useAuth()
  const [providers, setProviders] = useState<Provider[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [availability, setAvailability] = useState<availability[]>([])
  const [selectedHour, setSelectedHour] = useState(0)
  useEffect(() => {
    api.get('providers').then((response) => {
      setProviders(response.data)
    })
  }, [])

  useEffect(() => {
    api
      .get(`/providers/${selectedProvider}/day-availability`, {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate()
        }
      })
      .then((response) => {
        setAvailability(response.data)
      })
  }, [selectedDate, selectedProvider])

  const navigateBack = useCallback(() => {
    goBack()
  }, [goBack])

  const handleSelectProvider = useCallback((provider_id: string) => {
    setSelectedProvider(provider_id)
  }, [])

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker((state) => !state)
  }, [])

  const handleDateChange = useCallback((event: any, date: Date | undefined) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false)
    }
    if (date) {
      setSelectedDate(date)
    }
  }, [])

  const morgingAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour < 12)
      .map(({ available, hour }) => {
        return {
          hour,
          available,
          hourFormatted: format(new Date().setHours(hour), 'HH:00')
        }
      })
  }, [availability])

  const afternoonAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour >= 12)
      .map(({ available, hour }) => {
        return {
          hour,
          available,
          hourFormatted: format(new Date().setHours(hour), 'HH:00')
        }
      })
  }, [availability])

  const handleSelectHour = useCallback((hour: number) => {
    setSelectedHour(hour)
  }, [])

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate)

      date.setHours(selectedHour)
      date.setMinutes(0)

      await api.post('appointments', {
        provider_id: selectedProvider,
        date
      })
      console.log('====================================')
      console.log(date)
      console.log('====================================')

      navigate('AppointmentCreated', { date: date.getTime() })
    } catch (err) {
      console.log('====================================')
      console.log(err)
      console.log('====================================')
      Alert.alert(
        'Erro ao criar agendamento',
        'Ocorreu um erro ao tentar criar agendamento'
      )
    }
  }, [navigate, selectedDate, selectedHour, selectedProvider])

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={40} color="#999591" />
        </BackButton>

        <HeaderTitle>Cabeleireiros</HeaderTitle>
        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>
      <Content>
        <ProviderListContainer>
          <ProviderList
            horizontal
            data={providers}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(provider) => provider.id}
            renderItem={({ item: provider }) => (
              <ProviderContainer
                onPress={() => {
                  handleSelectProvider(provider.id)
                }}
                selected={provider.id === selectedProvider}
              >
                <ProviderAvatar source={{ uri: provider.avatar_url }} />
                <ProviderName selected={provider.id === selectedProvider}>
                  {provider.name}
                </ProviderName>
              </ProviderContainer>
            )}
          />
        </ProviderListContainer>
        <Title>Escolha a data </Title>

        <OpenDatePickerButton onPress={handleToggleDatePicker}>
          <OpenDatePickerButtonText>
            Selecionar outra data
          </OpenDatePickerButtonText>
        </OpenDatePickerButton>
        <Calendar>
          {showDatePicker && (
            <DateTimePicker
              onChange={handleDateChange}
              value={selectedDate}
              mode="date"
              display="calendar"
            />
          )}
        </Calendar>

        <Schedule>
          <Title>Escolha o horário</Title>

          <Section>
            <SectionTitle>Manhã</SectionTitle>
            <SectionContainer>
              {morgingAvailability.map(({ hourFormatted, hour, available }) => (
                <Hour
                  enabled={available}
                  selected={selectedHour === hour}
                  available={available}
                  key={hourFormatted}
                  onPress={() => {
                    handleSelectHour(hour)
                  }}
                >
                  <HourText selected={selectedHour === hour}>
                    {hourFormatted}
                  </HourText>
                </Hour>
              ))}
            </SectionContainer>
          </Section>

          <Section>
            <SectionTitle>Tarde</SectionTitle>
            <SectionContainer>
              {afternoonAvailability.map(
                ({ hourFormatted, hour, available }) => (
                  <Hour
                    enabled={available}
                    selected={selectedHour === hour}
                    available={available}
                    key={hourFormatted}
                    onPress={() => {
                      handleSelectHour(hour)
                    }}
                  >
                    <HourText selected={selectedHour === hour}>
                      {hourFormatted}
                    </HourText>
                  </Hour>
                )
              )}
            </SectionContainer>
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
