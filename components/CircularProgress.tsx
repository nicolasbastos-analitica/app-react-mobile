import React from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface Props {
  percentage: number; // Valor de 0 a 100
}

export default function CircularProgressFigma({ percentage }: Props) {
  // CONFIGURAÇÕES DO FIGMA
  const size = 90;          // Tamanho do círculo
  const strokeWidth = 10;    // Grossura da linha
  const color = "#00B16B";   // Verde EXATO do Figma (Sólido)
  const trackColor = "#FFF"; // Fundo cinza claro

  // Matemática do Círculo
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Limita a porcentagem e calcula o preenchimento
  const validPercentage = Math.min(Math.max(percentage, 0), 100);
  const strokeDashoffset = circumference - (validPercentage / 100) * circumference;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        
      {/* Rotação -90deg para começar do topo (meio-dia) */}
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: [{ rotate: '-90deg' }] }}>
        
        {/* 1. O Trilho (Fundo Cinza) */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* 2. O Progresso (Verde Sólido) */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round" // DEIXA A PONTA REDONDA
          // O Android precisa dessa string específica para funcionar o preenchimento:
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
        />
      </Svg>

      {/* Texto Centralizado */}
      <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 21, fontWeight: 'bold', color: '#37474F', fontFamily:'Montserrat' }}>
          {Math.round(validPercentage)}%
        </Text>
      
      </View>
    </View>
  );
}