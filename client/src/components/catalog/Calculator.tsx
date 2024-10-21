import { Box, FormControl, FormLabel, HStack, IconButton, Input, useColorModeValue } from "@chakra-ui/react"
import { useState } from "react"
import { FiPlus } from "react-icons/fi"
import { v7 as uuidv7 } from 'uuid';
import { CSVLink } from "react-csv";
import { IoRemoveOutline } from "react-icons/io5";
import type { CalculatorData } from "../../types/catalog.type";

function Calculator() {
  const [calculatorData, setCalculatorData] = useState<CalculatorData[]>([{
    id: uuidv7(),
    materie: '',
    medie: 0,
  }]);

  const borderColorValue = useColorModeValue('#F5F6F4', '#33373d');
  const bgColorValue = useColorModeValue('#F5F6F4', '#1d2025');

  const mean = calculatorData.map(e => e.medie * (e.nrCredite ?? 1)).reduce((a,b) => a + b, 0) / (calculatorData.map(e => e.nrCredite ?? 0).reduce((a,b) => a + b, 0) || 1);

  const csvData = [
    ["Materie", "Medie", "Nr. Credite", "Media Finala"],
    ...calculatorData.map(e => [e.materie, e.medie, e.nrCredite ?? '']),
    ["", "", "", mean]
  ];

  return (
    <Box className="calculatorContainer">
        <Box className="menuContainer" textAlign={'end'}>
          <IconButton icon={<FiPlus />} aria-label="Add Entry" fontSize={16} isRound colorScheme={'blue'} onClick={() => {
            setCalculatorData((prev) => {
              return [...prev, {id: uuidv7(), materie: '', medie: 0}];
            })
          }} />
          <CSVLink data={csvData} style={{marginLeft: '1rem', color: 'green', padding: '0.5rem', border: '1px solid green', borderRadius: '1rem', pointerEvents: calculatorData.length === 0 ? 'none' : 'auto'}} title={calculatorData.length === 0 ? 'Adauga cel putin o inregistrare pentru a putea exporta CSV' : undefined} filename="medii.csv" className="exportCSVLink">
            Export CSV
          </CSVLink>
        </Box>

        <Box p={'1rem'} border={`1px solid ${borderColorValue}`} mt={'1rem'} borderRadius={'8px'} bg={bgColorValue} maxH={'62vh'} overflowY={'auto'}>
        {
          calculatorData.length > 0 ?
            <>
              {
                calculatorData.map((element, index) => (
                  <HStack key={index} gap={'1rem'} mb={'1rem'}>
                    <FormControl isRequired>
                      <FormLabel>
                        Materie
                      </FormLabel>
                      <Input type={'text'} onChange={(e) => {
                        setCalculatorData((prev) => {
                          const updatedElement = prev.map(el => {
                            if(el.id === element.id) {
                              return {
                                ...el,
                                materie: e.target.value,
                              }
                            } else {
                              return el;
                            }
                          });
                          return updatedElement
                        });
                      }} value={element.materie} />
                    </FormControl>
      
                    <FormControl isRequired>
                      <FormLabel>
                        Medie
                      </FormLabel>
                      <Input type={'number'} onChange={(e) => {
                        setCalculatorData((prev) => {
                          const updatedElement = prev.map(el => {
                            if(el.id === element.id) {
                              return {
                                ...el,
                                medie: +e.target.value,
                              }
                            } else {
                              return el;
                            }
                          });
                          return updatedElement
                        });
                      }} defaultValue={element.medie || 1} min={1} />
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>
                        Nr. Credite
                      </FormLabel>
                      <Input type={'number'} onChange={(e) => {
                        setCalculatorData((prev) => {
                          const updatedElement = prev.map(el => {
                            if(el.id === element.id) {
                              return {
                                ...el,
                                nrCredite: +e.target.value,
                              }
                            } else {
                              return el;
                            }
                          });
                          return updatedElement
                        });
                      }} defaultValue={element.nrCredite || 0} min={0} />
                    </FormControl>
      
                    <Box mt={'1.5rem'}>
                      <IconButton icon={<IoRemoveOutline />} aria-label="Delete Entry" isRound colorScheme="red" color={'#fff'} fontSize={18} onClick={() => {
                        setCalculatorData((prev) => {
                          const updatedData = prev.filter(e => e.id !== element.id);
                          return updatedData;
                        });
                      }} />
                    </Box>
      
                  </HStack>
                ))
              }
            </>
            :
            <>
              <Box as={'p'} fontWeight={400} fontSize={18} textAlign={'center'}>
                Adauga o inregistrare apasand pe butonul de plus!
              </Box>
            </>
        }
        </Box>

        <Box className="meanContainer" border={`1px solid ${borderColorValue}`} borderRadius={'8px'} bg={bgColorValue} mt={'1rem'} p={'1rem'} textAlign={'center'} display={'flex'} alignItems={'center'} justifyContent={'space-between'} gap={'1rem'} flexWrap={'wrap'}>
            <Box as={'span'} fontSize={24} fontWeight={300}>
              Media:
            </Box>
            <Box fontSize={30} fontWeight={600}>
              {mean.toFixed(2)}
            </Box>
        </Box>
    </Box>
  )
}

export default Calculator