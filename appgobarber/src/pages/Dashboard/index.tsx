import React from 'react'
import { View, Text, Button } from 'react-native'

import { useAuth } from '../../hooks/auth'

const Dashboard: React.FC = () => {
  const { signOut } = useAuth()

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#fff', fontSize: 24 }}>Dashboard</Text>
      <Button title="Sair" onPress={signOut} />
    </View>
  )
}

export default Dashboard
