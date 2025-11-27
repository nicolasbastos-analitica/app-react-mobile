// src/lib/bluechip/decoderFactory.ts
// (Certifique-se que o caminho 'src/lib/bluechip' corresponde à sua estrutura)

// 1. Importar a interface e constantes/helpers necessários do types.ts
import {
    IBluechipDataDecoder,
    COMMAND_PREFIX,
    LINE_BREAK_SUFFIX,
    SPACE_REGEX,
    isValidCommand
} from './bluechipDecoder.types'; // Ajuste o caminho se necessário

// 2. Importar TODAS as classes de implementação concretas
// (Ajuste os caminhos conforme a sua estrutura de pastas!)
import { BluechipDataDecoderImplProtocol340 } from './BluechipDataDecoderImplProtocol340';
import { BluechipDataDecoderImplProtocol350 } from './BluechipDataDecoderImplProtocol350';
import { BluechipDataDecoderImplProtocol360 } from './BluechipDataDecoderImplProtocol360';
import { BluechipDataDecoderImplProtocol370 } from './BluechipDataDecoderImplProtocol370';

/**
 * Cria uma instância do decodificador Bluechip apropriado com base nos dados brutos recebidos.
 * Esta função age como a "fábrica" que substitui a lógica 'getInstance' e 'DataDecoderHandler' do Java.
 *
 * @param rawData A string de dados completa recebida do dispositivo (ex: "AT+BT_PRM=...\\r\\n").
 * @returns Uma instância que implementa IBluechipDataDecoder.
 * @throws Error se os dados forem inválidos ou nenhum protocolo compatível for encontrado.
 */
export function getInstance(rawData: string): IBluechipDataDecoder {
    // Valida se é um comando AT+BT_PRM válido (começa com prefixo, termina com sufixo)
    if (!isValidCommand(rawData)) {
        throw new Error("Dados inválidos: não é um comando AT+BT_PRM válido.");
    }

    // Limpa a string (remove prefixo, sufixo, espaços) para obter os dados hexadecimais puros
    const encodedData = rawData
        .replace(COMMAND_PREFIX, "")
        .replace(LINE_BREAK_SUFFIX, "")
        .replace(SPACE_REGEX, ""); // Usa a regex importada

    const length = encodedData.length;

    // Tenta instanciar e validar cada protocolo, começando pelo mais recente/longo
    // A ordem é importante para evitar que um protocolo mais antigo (e curto) seja
    // escolhido incorretamente para dados de um protocolo mais novo (e longo).
    try {
        // Tenta criar uma instância do Protocolo 370
        const decoder370 = new BluechipDataDecoderImplProtocol370(encodedData);
        // Chama o método isValidProtocol da própria instância para verificar
        if (decoder370.isValidProtocol(length)) {
             console.log("Decoder Factory: Usando Protocolo 3.7.0");
            return decoder370;
        }
    } catch (e) {
        // Ignora erros (ex: se a classe ainda não estiver totalmente implementada ou isValid falhar)
        // Você pode querer logar o erro em modo de desenvolvimento:
        // if (__DEV__) { console.warn("Falha ao tentar validar Protocolo 3.7.0:", e); }
    }

    try {
        const decoder360 = new BluechipDataDecoderImplProtocol360(encodedData);
        if (decoder360.isValidProtocol(length)) {
             console.log("Decoder Factory: Usando Protocolo 3.6.0");
            return decoder360;
        }
    } catch (e) {
        // if (__DEV__) { console.warn("Falha ao tentar validar Protocolo 3.6.0:", e); }
    }

    try {
        const decoder350 = new BluechipDataDecoderImplProtocol350(encodedData);
        if (decoder350.isValidProtocol(length)) {
             console.log("Decoder Factory: Usando Protocolo 3.5.0");
            return decoder350;
        }
    } catch (e) {
         // if (__DEV__) { console.warn("Falha ao tentar validar Protocolo 3.5.0:", e); }
    }

    try {
        // O Protocolo 340 é o mais antigo e curto, testado por último.
        const decoder340 = new BluechipDataDecoderImplProtocol340(encodedData);
        if (decoder340.isValidProtocol(length)) {
             console.log("Decoder Factory: Usando Protocolo 3.4.0");
            return decoder340;
        }
    } catch (e) {
        // if (__DEV__) { console.warn("Falha ao tentar validar Protocolo 3.4.0:", e); }
    }

    // Se nenhum protocolo anterior foi validado após tentar todos
    console.error(`Protocolo Bluechip não suportado ou dados inválidos para comprimento ${length}. Dados Limpos: ${encodedData}`);
    throw new Error(`Protocolo Bluechip não suportado para dados com comprimento ${length}.`);
}