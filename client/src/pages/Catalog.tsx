import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import CatalogComponent from "../components/catalog/Catalog"
import Calculator from "../components/catalog/Calculator"

function Catalog() {
  return (
    <Box className="catalogPageContainer" p={'1rem'}>
        <Tabs>
            <TabList>
                <Tab>Catalog</Tab>
                <Tab>Calculator</Tab>
            </TabList>

            <TabPanels>
                <TabPanel>
                    <CatalogComponent />
                </TabPanel>
                <TabPanel>
                    <Calculator />
                </TabPanel>
            </TabPanels>
        </Tabs>
    </Box>
  )
}

export default Catalog