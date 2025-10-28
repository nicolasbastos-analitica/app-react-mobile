import React, { useState } from "react";
import { View, ImageBackground, ActivityIndicator } from "react-native";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import "../../global.css";

const backgroundImage = require("../../../../meu-app-telemetria/assets/images/splash_screen.png");

export default function Login() {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <View className="flex-1 bg-black">
          <Drawer>
            <DrawerTrigger asChild>
              <Button
                variant='default'
                className="px-32 py-2 rounded-lg shadow-lg color-green-500 bg-green-500 absolute self-center z-10 text-neutral-50 "
            
              >
                Login
              </Button>
            </DrawerTrigger>

            <DrawerContent>
              <View className="mx-auto w-full max-w-sm p-4">
                <DrawerHeader>
                  <DrawerTitle>Login</DrawerTitle>
                  <DrawerDescription>
                    Digite o número do seu registro para localizar seu perfil.
                  </DrawerDescription>
                </DrawerHeader>

                <View className="my-4">
                  <input
                    type="number"
                    placeholder="Número do registro"
                    className="w-full border border-gray-300 rounded p-2"
                  />
                </View>

                <DrawerFooter>
                  <Button variant="default">Entrar</Button>
                </DrawerFooter>
              </View>
            </DrawerContent>
          </Drawer>
      <ImageBackground
  source={backgroundImage}
  resizeMode="cover"
  className="absolute inset-0 z-0"
/>
    </View>
  );
}
