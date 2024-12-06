"use client"

const TextInput = ({ label, placeholder, onChange, type = "text" }: {
    label: string,
    placeholder: string,
    onChange: any,
    type?: "text" | string
}) => {
    return (
        <div className="pt-2">
            <label className="block mb-2 text-sm font-medium text-gray-900">{ label }</label>
            <input type={type} onChange={onChange} placeholder={placeholder}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5"
            />
        </div>
    )
}

export default TextInput