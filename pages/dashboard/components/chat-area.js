import { ScrollArea } from "../../components/ui/scroll-area"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Loader2, Send, Home, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { sanitizeHtml } from '../../lib/sanitizeHtml'
import ReactMarkdown from 'react-markdown'

export default function ChatArea({
  selectedPet,
  chatMessages,
  isLoading,
  queryType,
  setQueryType,
  inputValue,
  setInputValue,
  handleChatSubmit
}) {
  const placeholderText = queryType === 'symptom'
    ? "Describe your pet's symptoms (e.g., 'coughing and sneezing')"
    : queryType === 'food'
    ? "Ask about a specific food (e.g., 'Is chicken good for dogs?')"
    : queryType === 'nutrition'
    ? "Ask about nutritional needs (e.g., 'Best diet for an overweight cat')"
    : "Select a query type and type your question"

  return (
    <>
      <ScrollArea className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto space-y-8">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link href="/" className="inline-flex items-center text-sm font-medium text-black hover:text-black">
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <span className="ml-1 text-sm font-medium text-black md:ml-2">{selectedPet.petName}</span>
                  </div>
                </li>
              </ol>
            </nav>
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2 text-black">Chat with PETOWK AI about {selectedPet.petName}</h2>
              <p className="text-black text-lg">
                Ask questions about {selectedPet.petName}'s health, nutrition, or care.
              </p>
            </div>
            <div className="space-y-6">
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-lg shadow-md ${
                      message.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-white text-black border border-gray-200'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <p>{message.content}</p>
                    ) : (
                      <div 
                        className="prose prose-sm max-w-none"
                      >
                        <ReactMarkdown>{sanitizeHtml(message.content)}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-center items-center space-x-2">
                  <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                  <span className="text-black">Processing your request...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="bg-white border-t border-gray-200 p-6 sticky bottom-0 shadow-lg">
        <form 
          onSubmit={handleChatSubmit} 
          className="max-w-4xl mx-auto grid grid-cols-4 gap-4 items-center"
        >
          <div className="col-span-4 md:col-span-1">
            <Select value={queryType} onValueChange={setQueryType}>
              <SelectTrigger className="w-full bg-gray-100 border border-gray-300 rounded-xl shadow-sm text-black hover:bg-gray-200 focus:ring-2 focus:ring-indigo-400 focus:outline-none px-4 py-3">
                <SelectValue placeholder="Choose a query type" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg text-black">
                <SelectItem value="symptom">Symptom</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="nutrition">Nutrition</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-4 md:col-span-3 relative flex items-center gap-2">
            <Input
              placeholder={placeholderText}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-indigo-50 border-2 border-indigo-300 text-black placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg py-3 px-4 shadow-sm"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              className="bg-black hover:bg-gray-800 text-white rounded-lg px-6 py-3 font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition duration-200"
              disabled={isLoading}
            >
              <span className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Send
              </span>
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
