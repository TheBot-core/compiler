FROM debian

RUN apt update
RUN apt install gcc g++ rustc nodejs python3 golang default-jdk npm make git pkg-config flex bison protobuf-compiler libnl-route-3-dev -y

RUN git clone https://github.com/google/nsjail.git
WORKDIR /nsjail
RUN make
RUN cp ./nsjail /bin/.

COPY . /compiler
WORKDIR /compiler
RUN npm install
RUN useradd cheese

ENTRYPOINT node .
