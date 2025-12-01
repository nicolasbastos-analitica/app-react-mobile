import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const Cronometro: React.FC = () => {
  const [segundos, setSegundos] = useState<number>(0);
  const [ativo, setAtivo] = useState<boolean>(false);

  useEffect(() => {
    let intervalo: ReturnType<typeof setInterval> | null = null;

    if (ativo) {
      intervalo = setInterval(() => {
        setSegundos((segundosAnteriores) => segundosAnteriores + 1);
      }, 1000);
    } else {
        // Se pausar, limpa o intervalo
        if (intervalo) clearInterval(intervalo);
    }

    // Cleanup function
    return () => {
      if (intervalo) clearInterval(intervalo);
    };
  }, [ativo]);

  const formatarTempo = (totalSegundos: number): string => {
    const minutos = Math.floor(totalSegundos / 60);
    const secs = totalSegundos % 60;
    
    const minString = minutos < 10 ? `0${minutos}` : minutos.toString();
    const secString = secs < 10 ? `0${secs}` : secs.toString();

    return `${minString}:${secString}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textoTempo}>{formatarTempo(segundos)}</Text>
      
      <View style={styles.botoes}>
        <Button 
          title={ativo ? 'Pausar' : 'Iniciar'} 
          onPress={() => setAtivo(!ativo)} 
        />
        <Button 
          title="Zerar" 
          onPress={() => {
            setAtivo(false);
            setSegundos(0);
          }} 
          color="red"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 20 
  },
  textoTempo: { 
    fontSize: 48, 
    fontWeight: 'bold', 
    marginBottom: 20,
    fontVariant: ['tabular-nums'] 
  },
  botoes: { 
    flexDirection: 'row', 
    gap: 10 
  }
});

export default Cronometro;