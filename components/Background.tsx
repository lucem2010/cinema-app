import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Background = ({ width, height }) => {
  return (
    <View style={[styles.background, { width, height }]}>
      <Text>Background</Text>
    </View>
  )
}

export default Background

const styles = StyleSheet.create({
  background: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',  
  },
})
